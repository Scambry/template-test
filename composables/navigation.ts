export function useNavigationMenu() {
  const navigationMenu = () => {
    return [
      {
        label: 'Home',
        items: [{
          label: 'Landing Page',
          to: '/',
          icon: 'pi pi-fw pi-home',
        }],
      },
      {
        label: 'Game',
        items: [
          { label: 'Teleporter ', icon: 'pi pi-fw pi-user-edit', to: '/teleporter' },
        ],
      }

    ]
  }

  return { navigationMenu }
}
