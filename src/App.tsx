import { useEffect, useState } from 'react';
import './App.css';
import { getWeaponSkins, getWeaponNames, getBundles } from './api';

interface Weapon {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

interface WeaponSkin {
  uuid: string;
  displayName: string;
  displayIcon: string;
  themeUuid: string | null;
  wallpaper: string | null;
}

interface Bundle {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

function App() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [skins, setSkins] = useState<WeaponSkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscando armas, bundles e skins simultaneamente
        const [weaponsData, bundlesData, skinsData] = await Promise.all([
          getWeaponNames(),
          getBundles(),
          getWeaponSkins(),
        ]);
        setWeapons(weaponsData);
        setBundles(bundlesData);
        setSkins(skinsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBundleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBundle(event.target.value);
  };

  const combineNames = (bundleName: string, weaponName: string): string => {
    return `${bundleName} ${weaponName}`;
  };

  const fundoBundle = bundles.find((bundle) => bundle.uuid === selectedBundle)?.displayIcon ||
  './public/valorantbg.jpg';

  const wallpaper = `url(${fundoBundle})`;

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div 
    style={{ backgroundImage: `${wallpaper}` }}
    className="bg-cover bg-no-repeat w-screen h-screen flex flex-col justify-start items-center font-mono">
      <div className="bg-linear-to-b from-neutral-950/50 to-neutral-950/50 w-screen h-screen flex flex-col justify-start items-center font-mono">
        <div className="text-white text-2xl mb-4 flex flex-row justify-center items-center w-1/2 h-12 inset-x-0 top-0">
          <div className="bg-red-400 w-14 h-12 rotate-60 translate-x-9 -translate-y-3"></div>
          <h1 className="bg-red-400 w-1/2 flex justify-center h-12 items-center">Coleções do Valorant</h1>
          <div className="bg-red-400 w-14 h-12 rotate-300 -translate-x-9 -translate-y-3"></div>
        </div>
        {/* Seção do dropdown de bundles */}
        <div className="my-4 flex flex-col justify-center items-center">
          <label className="justify-center" htmlFor="bundle-select"></label>
          <select
            id="bundle-select"
            value={selectedBundle}
            onChange={handleBundleChange}
            className="text-white bg-black flex flex-col justify-center items-center"
          >
            <option value="" className='flex flex-col justify-center items-center'>Selecione...</option>
            {bundles.map((bundle) => (
              <option key={bundle.displayName} value={bundle.uuid}>
                {bundle.displayName}
              </option>
            ))}
          </select>
        </div>
        {/* Seção do grid de armas */}
        <h1 className="mt-4 mb-8"></h1>
        <div
          className="px-8 grid grid-cols-4 gap-4 bg-red flex flex-wrap justify-center max-h-fit max-w-screen"
        >
          {weapons.map((weapon) => {
            const bundleName = bundles.find((bundle) => bundle.uuid === selectedBundle)?.displayName ||
            '';
            const combineName = combineNames(bundleName, weapon.displayName);

            const skinIcon = skins.find((skin) => skin.displayName === combineName)?.displayIcon ||
            null;

            if (skinIcon != null) return (
              <div className="p-4 min-w-80 min-h-[130px] border-neutral-500 border-2 hover:border-sky-500 hover:scale-102 duration-300 rounded-lg bg-linear-to-b from-neutral-950/45 to-neutral-950/45">
                <img src={skinIcon} alt="" className="max-h-24 justify-self-center"/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
