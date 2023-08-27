<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import ComposerTool from './composer-tool.vue'

    const props = defineProps({
        id: Number,
        initValue: { type: String, default: 'Your content here...' }
    })

    const emit = defineEmits(['doUpdate', 'doDuplicate', 'doDelete'])

    let mode = ref('read')
    let value = ref(props.initValue)

    onMounted(() => {
        console.log('composer-text', props)
    })

    const onInputBlur = () => {
        mode.value = 'read'
        emit('doUpdate', value.value, props.id)
    }

    const onDuplicate = () => {
        emit('doDuplicate', props.id)
    }

    const onDelete = () => {
        emit('doDelete', props.id)
    }
</script>

<template>
    <composer-tool 
        class="composer-text" 
        @on-edit="mode = 'write'"
        @on-duplicate="onDuplicate"
        @on-delete="onDelete"
    >
        <template v-if="mode === 'write'">
            <input v-model="value" placeholder="edit me" @blur="onInputBlur" />
        </template>
        <template v-else>
            {{ value }}
        </template>
    </composer-tool>
</template>

<style scoped lang="scss">
    input {
        padding: 4px;
        width: -webkit-fill-available;
        border: 0.1rem solid #ccc;
        border-radius: 4px;
    }
</style>