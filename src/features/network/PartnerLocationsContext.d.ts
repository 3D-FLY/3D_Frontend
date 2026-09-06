import type { ReactElement, ReactNode } from "react";

export interface PartnerLocation {
  id: string;
  lat: number;
  lng: number;
  name?: string;
  cityName?: string;
  countryName?: string;
}

export const INITIAL_PARTNERS: PartnerLocation[];

export function PartnerLocationsProvider(props: { children: ReactNode }): ReactElement;

export function usePartnerLocations(): {
  partners: PartnerLocation[];
  addPartner: (partner: PartnerLocation) => void;
  removePartner: (id: string) => void;
};
