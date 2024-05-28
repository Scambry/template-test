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
          { label: 'Game 1', icon: 'pi pi-fw pi-user-edit', to: '/templates/blueprint' },
          { label: 'Game 2', icon: 'pi pi-fw pi-user-edit', to: '/templates/blueprint2' },
        ],
      }

    ]
  }

  return { navigationMenu }
}
