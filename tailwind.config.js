/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            screens: {
                print: { raw: 'print' },
                screen: { raw: 'screen' },
            },
        },
    },
    plugins: [],
};
