<script setup lang="ts">
const items = [{
    label: 'active',
    active: true,
},
{
    label: 'inactive',
    active: false,
}
]

const emit = defineEmits(['change'])

function onChange(index: number) {
    const item = items[index]
    emit('change', item.active)
}

</script>

<template>
    <UTabs :items="items" @change="onChange" />
</template>
