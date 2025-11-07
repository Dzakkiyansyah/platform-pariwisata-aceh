'use server'

import { createClient } from "@/lib/supabase/server";
import { type ActionState } from "@/types/actions";
import { revalidatePath } from "next/cache";

// Update Informasi Umum
export async function updateInfoUmum(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Anda tidak terautentikasi." };

  const destinationId = Number(formData.get("destinationId"));
  if (!destinationId) return { error: "ID destinasi tidak valid." };

  const imageFile = formData.get("image_url") as File | null;
  let imageUrl = formData.get("current_image_url") as string;

  // Upload gambar baru jika ada file
  if (imageFile && imageFile.size > 0) {
    const filePath = `${destinationId}/cover-${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("gambar-destinasi")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Cover Image Upload Error:", uploadError);
      return { error: "Gagal mengunggah gambar utama." };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("gambar-destinasi")
      .getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const rawData = {
    name: formData.get("name") as string,
    category_id: Number(formData.get("category_id")),
    address: formData.get("address") as string,
    open_time: formData.get("open_time") as string,
    ticket_price: (formData.get("ticket_price") as string) || "Gratis",
    website: formData.get("website") as string,
    image_url: imageUrl,
  };

  const { error } = await supabase
    .from("destinations")
    .update(rawData)
    .eq("id", destinationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update Info Umum Error:", error);
    return { error: "Gagal memperbarui informasi umum." };
  }

  // Revalidate halaman-halaman terkait
  revalidatePath("/pengelola/destinasi");
  revalidatePath("/");
  revalidatePath("/destinasi");

  const { data: slugData } = await supabase
    .from("destinations")
    .select("slug")
    .eq("id", destinationId)
    .single();

  if (slugData?.slug) revalidatePath(`/destinasi/${slugData.slug}`);

  return { message: "Informasi umum berhasil diperbarui." };
}

// Update Deskripsi & Fasilitas
export async function updateDeskripsi(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Anda tidak terautentikasi." };

  // Nama field dari form: destination_id
  const destinationId = Number(formData.get("destination_id"));
  if (!destinationId) return { error: "ID destinasi tidak valid." };

  const description = (formData.get("description") as string)?.trim() || "";
  const facilitiesRaw = (formData.get("facilities") as string)?.trim() || "";

  console.log("== DEBUG UPDATE DESKRIPSI ==");
  console.log("destinationId:", destinationId);
  console.log("description:", description);
  console.log("facilitiesRaw:", facilitiesRaw);

  const facilities = facilitiesRaw
    ? facilitiesRaw.split(",").map(f => f.trim()).filter(Boolean)
    : [];

  const { data, error } = await supabase
    .from("destinations")
    .update({ description, facilities })
    .eq("id", destinationId)
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.error("Update Deskripsi Error:", error);
    return { error: `Gagal memperbarui deskripsi & fasilitas. (${error.message})` };
  }

  console.log("Update success", data);
  revalidatePath("/pengelola/destinasi");
  return { message: "Deskripsi & fasilitas berhasil diperbarui." };
}

// Update Lokasi (Map)
export async function updateLokasi(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Anda tidak terautentikasi." };

  const destinationId = Number(formData.get("destinationId"));
  if (!destinationId) return { error: "ID destinasi tidak valid." };

  const rawData = {
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng")),
  };

  const { error } = await supabase
    .from("destinations")
    .update(rawData)
    .eq("id", destinationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update Lokasi Error:", error);
    return { error: "Gagal memperbarui lokasi peta." };
  }

  revalidatePath("/pengelola/destinasi");
  return { message: "Lokasi peta berhasil diperbarui." };
}

// Upload Foto Galeri
export async function uploadPhotos(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Anda tidak terautentikasi." };

  const destinationId = Number(formData.get("destinationId"));
  const files = formData.getAll("photos") as File[];

  if (!destinationId) return { error: "ID destinasi tidak valid." };
  if (files.length === 0 || files[0].size === 0)
    return { error: "Pilih setidaknya satu file untuk diunggah." };

  for (const file of files) {
    const filePath = `${destinationId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("gambar-destinasi")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return { error: `Gagal mengunggah ${file.name}. Periksa RLS Storage.` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("gambar-destinasi")
      .getPublicUrl(filePath);

    await supabase.from("destination_photos").insert({
      destination_id: destinationId,
      photo_path: publicUrl,
    });
  }

  revalidatePath("/pengelola/destinasi");
  return { message: `${files.length} foto berhasil diunggah.` };
}

// Hapus Foto Galeri
export async function deletePhoto(photoId: number, photoPath: string) {
  const supabase = await createClient();

  await supabase.from("destination_photos").delete().eq("id", photoId);

  const filePath = photoPath.split("/gambar-destinasi/")[1];
  await supabase.storage.from("gambar-destinasi").remove([filePath]);

  revalidatePath("/pengelola/destinasi");
}
