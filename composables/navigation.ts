export function useNavigationMenu() {
  const navigationMenu = () => {
    return [
      {
        label: 'Game',
        items: [
          { label: 'Teleporter ', icon: 'pi pi-fw pi-user-edit', to: '/teleporter' },
        ],
      },

    ]
  }

  return { navigationMenu }
}
