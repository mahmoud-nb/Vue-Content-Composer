<script setup lang="ts">
    defineEmits(['onEdit'])
</script>

<template>
    <div class="composer-tool">
        <slot />
        <div class="composer-tool__actions">
            <span @click="$emit('onEdit')">Edit</span> -
            <span @click="$emit('onDuplicate')">Duplicate</span> -
            <span @click="$emit('onDelete')">Delete</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.composer-tool {
    background-color: #FFF;
    padding: 4px;
    border-radius: 8px;

    &__actions {
        margin-top: 8px;
        font-size: 11px;
        line-height: 11px;
        text-align: right;
        border-top: 1px solid #EFEFEF;
        padding-top: 4px;

        & > span {
            cursor: pointer;
        }
    }
}
</style>