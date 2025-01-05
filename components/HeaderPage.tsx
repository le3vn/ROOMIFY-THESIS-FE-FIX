import React from 'react';
import Image from 'next/image';

const HeaderPage = () => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/Assets/images/font-title-master.png"
        alt="Title Master"
        width={720}
        height={100}
      />
      <div className="text-center mt-2">
        <p className='text-white text-sm'>Unlock the door to convenience with Roomify. : Where booking a room becomes</p>
        <p className='text-white text-sm'>as effortless as turning the key.</p>
      </div>
    </div>
  );
};

export default HeaderPage;