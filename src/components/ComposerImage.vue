<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import ComposerTool from './ComposerTool.vue'
    import { ImageOption } from '../models/globals'

    const props = defineProps({
        id: Number,
        options: { type: Array<ImageOption>, required: true },
        initValue: { type: Object, default: null }
    })

    const emit = defineEmits(['doUpdate', 'doDuplicate', 'doDelete'])

    let mode = ref('read')
    let selectedOption = reactive<ImageOption>(props.options[0])
    let value:any = ref(props.initValue)

    onMounted(() => {
        selectedOption = props.options[0]
        emit('doUpdate', selectedOption, props.id)
    })

    const onChange = () => {
        mode.value = 'read'
        selectedOption = props.options.find( el => el.id === value.value)
        emit('doUpdate', selectedOption, props.id)
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
        class="composer-image" 
        @on-edit="mode = 'write'"
        @on-duplicate="onDuplicate"
        @on-delete="onDelete"
    >
        <div class="composer-image__display">
            <img v-if="selectedOption" :src="selectedOption.src" :alt="selectedOption.name" />
        </div>
        <template v-if="mode === 'write'">
            <select v-model="value" @change="onChange" >
                <option 
                    v-for="option in props.options" 
                    :key="`composer-image-${option.id}`" 
                    :value="option.id"
                >{{ option.name }}</option>
            </select>
        </template>
    </composer-tool>
</template>

<style scoped lang="scss">
.composer-image {

    &__display {
        display: block;
        text-align: center;
    }

    select {
        padding: 6px;
        width: -webkit-fill-available;
        border: 0.1rem solid #ccc;
        border-radius: 4px;
    }
}
</style>