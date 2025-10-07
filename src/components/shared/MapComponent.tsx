// src/components/shared/MapComponent.tsx
'use client'

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface MapComponentProps {
    lat: number;
    lng: number;
}

export default function MapComponent({ lat, lng }: MapComponentProps) {
    const position = { lat, lng };

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return <div>API Key for Google Maps is missing.</div>
    }

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                defaultCenter={position}
                defaultZoom={15}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className="w-full h-full rounded-lg"
            >
                <Marker position={position} />
            </Map>
        </APIProvider>
    );
}