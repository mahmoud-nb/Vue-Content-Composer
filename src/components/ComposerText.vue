<script setup lang="ts">
    import { ref, onMounted, Ref } from 'vue'
    import ComposerTool from './ComposerTool.vue'

    enum DisplayMode { READ, WRITE }

    const props = defineProps({
        id: { type: String, required: true },
        initValue: { type: String, default: 'Your content here...' }
    })

    const emit = defineEmits(['doUpdate', 'doDuplicate', 'doDelete'])

    const mode:Ref<DisplayMode> = ref(DisplayMode.READ)
    const text:Ref<string> = ref(props.initValue)

    onMounted(() => {
        emit('doUpdate', text.value, props.id)
    })

    const setMode = (displayMode:DisplayMode) => {
        mode.value = displayMode
    }

    const onInputBlur = () => {
        mode.value = DisplayMode.READ
        emit('doUpdate', text.value, props.id)
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
        @on-edit="mode = DisplayMode.WRITE"
        @on-duplicate="onDuplicate"
        @on-delete="onDelete"
    >
        <template v-if="mode === DisplayMode.WRITE">
            <input v-model="text" placeholder="edit me" @blur="onInputBlur" />
        </template>
        <template v-else>
            <div @dblclick="setMode(DisplayMode.WRITE)">{{ text }}</div>
        </template>
        <slot />
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