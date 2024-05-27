import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Resource {
    id: number;
    name: string;
    count: number;
    icon: string;
}

export const useOrbsStore = defineStore('orbs', () => {
    const dust = ref<Resource[]>([]);
    const orbs = ref<Resource[]>([]);

    const initData = () => {
        dust.value = [
            { id: 1, name: 'Black', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 2, name: 'Blue', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 3, name: 'Green', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 4, name: 'Orange', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 5, name: 'Purple', count: 0, icon: 'https://picsum.photos/200/300' },
        ];

        orbs.value = [
            { id: 1, name: 'Black', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 2, name: 'Blue', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 3, name: 'Green', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 4, name: 'Orange', count: 0, icon: 'https://picsum.photos/200/300' },
            { id: 5, name: 'Purple', count: 0, icon: 'https://picsum.photos/200/300' },
        ];
    };

    const getResource = (resourceId: number, resourceList: Resource[]) => {
        return resourceList.find(r => r.id === resourceId);
    };

    const incrementResource = (resourceId: number, resourceList: Resource[]) => {
        const resource = getResource(resourceId, resourceList);
        if (resource) {
            resource.count++;
        }
    };

    const decrementResource = (resourceId: number, resourceList: Resource[]) => {
        const resource = getResource(resourceId, resourceList);
        if (resource && resource.count > 0) {
            resource.count--;
        }
    };

    return { dust, orbs, getResource, incrementResource, decrementResource, initData };
});
