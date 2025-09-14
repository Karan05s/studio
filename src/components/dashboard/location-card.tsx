'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader, AlertTriangle } from 'lucide-react';
import type { Position } from '@/types';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
} from '@react-google-maps/api';

interface LocationCardProps {
  onPositionChange: (position: Position | null) => void;
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
};

export function LocationCard({ onPositionChange }: LocationCardProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
  });

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setPosition(newPosition);
          onPositionChange(newPosition);
          setError(null);
        },
        (err) => {
          let message = 'An unknown error occurred.';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              message =
                'Location access denied. Please enable it in your browser settings.';
              break;
            case err.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case err.TIMEOUT:
              message = 'The request to get user location timed out.';
              break;
          }
          setError(message);
          onPositionChange(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      onPositionChange(null);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [onPositionChange]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-destructive">
          <AlertTriangle className="mb-2 h-8 w-8" />
          <p className="font-semibold">Location Error</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (loadError) {
      return (
         <div className="flex flex-col items-center justify-center text-center text-destructive">
          <AlertTriangle className="mb-2 h-8 w-8" />
          <p className="font-semibold">Map Loading Error</p>
          <p className="text-sm">Could not load Google Maps. Please check the API key and its configuration.</p>
        </div>
      )
    }
    if (isLoaded && position) {
      return (
        <div className="space-y-2">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: position.latitude, lng: position.longitude }}
            zoom={15}
          >
            <MarkerF
              position={{ lat: position.latitude, lng: position.longitude }}
            />
          </GoogleMap>
          <div className="text-center">
            <div className="font-mono text-sm text-muted-foreground">
              <span>Lat: {position.latitude.toFixed(5)}</span>
              <span className="ml-4">
                Lon: {position.longitude.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <Loader className="mb-2 h-8 w-8 animate-spin" />
        <p>Acquiring your location...</p>
      </div>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex-row items-center justify-center space-x-2 pb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-headline">Live Location</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[340px] items-center justify-center p-2">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
