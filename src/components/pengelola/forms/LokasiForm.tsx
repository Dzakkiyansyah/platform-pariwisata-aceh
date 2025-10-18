'use client'

import { useActionState, useEffect, useState } from "react";
import { updateLokasi } from "@/app/(pengelola)/pengelola/destinasi/actions";
import { type ActionState } from "@/types/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { LocateFixed } from "lucide-react";

type Destination = { lat: number | null, lng: number | null };

// Separate component for map actions to avoid re-rendering the whole map
function MapActions({ setPosition }: { setPosition: (pos: { lat: number, lng: number }) => void }) {
    const map = useMap();

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setPosition(newPos);
                    if (map) map.panTo(newPos); // Move the map to the new location
                },
                (err) => toast.error("Gagal mendapatkan lokasi: " + err.message)
            );
        } else {
            toast.error("Browser Anda tidak mendukung Geolocation.");
        }
    }

    return (
        <Button type="button" variant="outline" onClick={handleUseCurrentLocation} className="mt-4">
            <LocateFixed className="h-4 w-4 mr-2" />
            Gunakan Lokasi Saat Ini
        </Button>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Lokasi"}</Button>;
}

export default function LokasiForm({ destination }: { destination: Destination }) {
    // Default to Banda Aceh if no location is set
    const defaultPosition = { lat: destination.lat || 5.5539, lng: destination.lng || 95.3174 };
    const [position, setPosition] = useState(defaultPosition);

    const initialState: ActionState = {};
    const [state, formAction] = useActionState(updateLokasi, initialState);

    useEffect(() => {
        if (state?.message) toast.success(state.message);
        if (state?.error) toast.error(state.error);
    }, [state]);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Lokasi Peta</CardTitle>
                    <CardDescription>Klik dan geser pin untuk menentukan lokasi, atau gunakan lokasi Anda saat ini.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Check for API Key before rendering the map */}
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                            <div className="h-[400px] rounded-lg overflow-hidden">
                                <Map
                                    defaultCenter={position}
                                    center={position}
                                    defaultZoom={15}
                                    mapId="pengelola-map"
                                    gestureHandling={'greedy'}
                                >
                                    <Marker
                                        position={position}
                                        draggable={true}
                                        onDragEnd={(e) => setPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })}
                                    />
                                </Map>
                            </div>
                            <MapActions setPosition={setPosition} />
                        </APIProvider>
                    ) : (
                        <div className="text-red-600 p-4 border border-red-200 bg-red-50 rounded-md">
                            Kunci API Google Maps tidak ditemukan. Harap periksa file .env.local Anda.
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>Latitude</label>
                            <Input name="lat" value={position.lat} readOnly />
                        </div>
                        <div className="space-y-2">
                            <label>Longitude</label>
                            <Input name="lng" value={position.lng} readOnly />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}