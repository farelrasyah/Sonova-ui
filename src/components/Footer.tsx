import React from 'react';

export default function Footer() {
  const languages = [
    'English', 'Deutsch', 'Русский', 'Français', 'Español', 'Українська',
    'Lietuvių', 'Nederlands', '中文(简体)', 'Bahasa Indonesia', 'Português',
    'Italiano', 'العربية', 'Türkçe', 'Polski', 'Svenska', 'Norsk',
    'Čeština', 'Македонски', 'Română', 'Eesti', 'Latviešu', 'Slovenčina',
    'Slovenščina', 'Suomi', 'Magyar', 'Dansk', 'Ελληνικά', 'Български',
    'Српски', 'Hrvatska', 'Bosanski', 'Shqip', 'Català', 'Galego',
    'Euskera', 'Esperanto', 'Interlingua', 'Volapük', 'Ido', 'Occidental',
    'Novial', 'Lojban', 'Toki Pona', 'Klingon', 'Vulcan', 'Na\'vi'
  ];

  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Languages */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Languages</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-gray-400">
            {languages.map((lang, index) => (
              <React.Fragment key={lang}>
                <span className="hover:text-white cursor-pointer transition-colors">
                  {lang}
                </span>
                {index < languages.length - 1 && <span className="text-gray-600">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold">
              <span className="text-white">Loader</span>
              <span className="text-purple-400">.fo</span>
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Copyright © 2024 All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
