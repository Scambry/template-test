export function useNavigationMenu() {
  const navigationMenu = () => {
    return [
      {
        label: 'Templates',
        items: [
          { label: 'Blueprint', icon: 'pi pi-fw pi-user-edit', to: '/templates/blueprint' },
          { label: 'Blueprint 2', icon: 'pi pi-fw pi-user-edit', to: '/templates/blueprint2' },
        ],
      }

    ]
  }

  return { navigationMenu }
}
