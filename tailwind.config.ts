import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        areia: '#E6D3A3',
        terracota: '#C65D3B',
        mandacaru: '#5F7F3A',
        carvao: '#1A1A1A',
        barro: '#8E3F2B'
      },
      fontFamily: {
        titulo: ['field-gothic', 'Impact', 'sans-serif'],
        texto: ['pacaembu', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
};
export default config;
