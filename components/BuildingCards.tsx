/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BuildingResponse } from '@/interface/Buildings';
import Link from 'next/link';





const BuildingCards = ({ search }) => {
  const searchParams = useSearchParams();
  const swrFetcher = useSwrFetcherWithAccessToken();
  const router = useRouter();

  // Update the URL parameter when the parent `search` prop changes


  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if(search) {
      params.set('Search', search);
    } else {
      params.delete('Search');
    }

    

    router.push(`${(search == '' ? '' : '?')}` + `${params.toString()}`);
  }, [search]);

  // Fetch data based on the updated `query`
  const { data: buildings } = useSWR<BuildingResponse>(`${BackendApiUrl.getBuilding}${search == "" ? '' : `?Search=${search}`}`,
    swrFetcher
  );


  return (
    <div className="grid grid-cols-3 gap-4">
      {buildings?.buildingList.map((room) => (
        <Link key={room.buildingId} href={`/room/${room.buildingId}`}>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <img
              src={room.minioUrl}
              className="w-full h-48 object-cover rounded-lg"
              alt=""
            />
            <h1 className="mt-4 text-lg font-bold">{room.name}</h1>
          </div>
        </Link>
      ))}
    </div>
  );
};


export default BuildingCards;
