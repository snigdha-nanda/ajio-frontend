import React from 'react';

const PromoBar = () => (
  <section className="flex items-center justify-center bg-red-600 py-4">
    <div className="bg-gray-100 rounded-full px-8 py-2 flex items-center space-x-2">
      <span className="font-bold">PAY UP TO 5%</span>
      <span>using your AJIO Points</span>
      <a href="/points" className="underline text-sm">
        Click for details
      </a>
    </div>
  </section>
);

export default PromoBar;
