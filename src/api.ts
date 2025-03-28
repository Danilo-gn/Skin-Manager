import axios from 'axios';

interface WeaponSkin {
    uuid: string;
    displayName: string;
    displayIcon: string;
    themeUuid: string | null;
    wallpaper: string | null;
}

interface WeaponNames {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

interface Bundle {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

const api = axios.create({
  baseURL: 'https://valorant-api.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWeaponNames = async (): Promise<WeaponNames[]> => {
  try {
    const response = await api.get('/weapons');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar skins de armas:', error);
    throw error;
  }
};

export const getWeaponSkins = async (): Promise<WeaponSkin[]> => {
  try {
    const response = await api.get('/weapons/skins');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar skins de armas:', error);
    throw error;
  }
};

export const getBundles = async (): Promise<Bundle[]> => {
  try {
    const response = await api.get('/bundles'); // Endpoint dos bundles
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar bundles:', error);
    throw error;
  }
};