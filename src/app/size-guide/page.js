import Link from 'next/link'

export const metadata = {
  title: "Size Guide | TIM'S GLAM",
  description: "Find your perfect fit with our comprehensive size guide for men, women, boys, and girls fashion.",
}

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-3">Size Guide</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Use our size charts to find the perfect fit. If you are between sizes, we recommend sizing up.</p>
          </div>

          <div className="space-y-8">

            {/* Women's Sizes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Women&apos;s Tops &amp; Dresses</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Size', 'UK', 'EU', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['XS', '6', '34', '80-83', '61-64', '87-90'],
                      ['S', '8', '36', '84-87', '65-68', '91-94'],
                      ['M', '10', '38', '88-91', '69-72', '95-98'],
                      ['L', '12', '40', '92-96', '73-77', '99-103'],
                      ['XL', '14', '42', '97-101', '78-82', '104-108'],
                      ['XXL', '16', '44', '102-107', '83-88', '109-114'],
                    ].map(([size, uk, eu, bust, waist, hips]) => (
                      <tr key={size} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-primary-600">{size}</td>
                        <td className="px-4 py-3 text-gray-700">{uk}</td>
                        <td className="px-4 py-3 text-gray-700">{eu}</td>
                        <td className="px-4 py-3 text-gray-700">{bust}</td>
                        <td className="px-4 py-3 text-gray-700">{waist}</td>
                        <td className="px-4 py-3 text-gray-700">{hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Men's Sizes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Men&apos;s Tops &amp; Shirts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Size', 'Chest (cm)', 'Waist (cm)', 'Shoulder (cm)', 'Sleeve (cm)'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['S', '88-92', '74-78', '43-44', '62-63'],
                      ['M', '96-100', '82-86', '45-46', '64-65'],
                      ['L', '104-108', '90-94', '47-48', '66-67'],
                      ['XL', '112-116', '98-102', '49-50', '68-69'],
                      ['XXL', '120-124', '106-110', '51-52', '70-71'],
                    ].map(([size, chest, waist, shoulder, sleeve]) => (
                      <tr key={size} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-800">{size}</td>
                        <td className="px-4 py-3 text-gray-700">{chest}</td>
                        <td className="px-4 py-3 text-gray-700">{waist}</td>
                        <td className="px-4 py-3 text-gray-700">{shoulder}</td>
                        <td className="px-4 py-3 text-gray-700">{sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kids' Sizes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Kids (Boys &amp; Girls)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Label', 'Age', 'Height (cm)', 'Chest (cm)', 'Waist (cm)'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['2T', '1-2 yrs', '86-92', '50-52', '49-51'],
                      ['3T', '2-3 yrs', '92-98', '52-54', '51-53'],
                      ['4T', '3-4 yrs', '98-104', '54-56', '53-55'],
                      ['S (6)', '5-6 yrs', '112-118', '58-62', '56-58'],
                      ['M (8)', '7-8 yrs', '122-128', '62-66', '58-62'],
                      ['L (10)', '9-10 yrs', '132-138', '66-70', '62-66'],
                      ['XL (12)', '11-12 yrs', '142-150', '72-76', '66-70'],
                    ].map(([label, age, height, chest, waist]) => (
                      <tr key={label} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gold-600">{label}</td>
                        <td className="px-4 py-3 text-gray-700">{age}</td>
                        <td className="px-4 py-3 text-gray-700">{height}</td>
                        <td className="px-4 py-3 text-gray-700">{chest}</td>
                        <td className="px-4 py-3 text-gray-700">{waist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to Measure */}
            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">How to Take Your Measurements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold mb-1">Bust / Chest</p>
                  <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Waist</p>
                  <p>Measure around the narrowest part of your waist, typically above the navel.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Hips</p>
                  <p>Measure around the fullest part of your hips, usually 20 cm below the waist.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Still not sure?</p>
                  <p>Reach out via our <Link href="/contact" className="text-primary-600 hover:underline">Contact page</Link> and we&apos;ll help you choose the right size.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 flex gap-4 text-sm text-gray-500">
            <Link href="/faq" className="hover:text-primary-600 transition-colors">FAQ</Link>
            <span>·</span>
            <Link href="/returns" className="hover:text-primary-600 transition-colors">Returns Policy</Link>
            <span>·</span>
            <Link href="/shop" className="hover:text-primary-600 transition-colors">Back to Shop</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
