<script setup lang="ts">
    import { reactive, computed, onMounted, shallowRef, defineAsyncComponent } from 'vue'
    //import { uuid } from 'uuidv4';
    import { Tool, ContentElement } from '../models/globals'

    onMounted(() => {
        console.log('The initial')
    })

    let bodyContentEls = reactive<Array<ContentElement>>([])

    let draggedElement = reactive<Tool|ContentElement>(null)
    let hoveredElement = reactive<{ el: Tool, index: number } | {}>({})

    const imagesData = reactive([
        { id: 1, name: 'Image 1', src: 'https://picsum.photos/220/160' }, 
        { id: 2, name: 'Image 2', src: 'https://picsum.photos/280/100' },
        { id: 3, name: 'Image 3', src: 'https://picsum.photos/260/120' },
        { id: 4, name: 'Image 4', src: 'https://picsum.photos/220/100' }
    ])

    const getAttributes = (name: string) => {
        if (!name) return {}

        return {
            ...( name === 'Text' && {} ),
            ...( name === 'Image' && { options: imagesData } ),
        }
    }

    const tools = computed (() => [
        { name: 'Text' },
        { name: 'Image' },
    ])


    const onDragStart = (el:Tool|ContentElement) => {  
        draggedElement = el
    }

    const onDragEnd = (index:number, source:string = 'toolbar') => {
        const loadComponent = (type: string) => shallowRef(defineAsyncComponent(() =>import(`./Composer${type}.vue`)))

        if (source === 'toolbar') {
            const contentElement: ContentElement = {
                id: Date.now(), // TODO : use uuid() for unique id
                name: draggedElement.name,
                component: loadComponent(draggedElement.name),
                value: ''
            }

            bodyContentEls.push(contentElement)
        } else {
            const contentElement: ContentElement = bodyContentEls.find(el => el.id === draggedElement.id)
            bodyContentEls.splice(index, 1)
            bodyContentEls.splice(hoveredElement.index, 0, contentElement)
        }
        draggedElement = null
        hoveredElement = {}
        
    }

    const onDragover = (el:Tool|ContentElement, index:number) => {
        hoveredElement = { el, index } 
    }

    const isOver = (el:Tool|ContentElement) => {
        if (!el?.id || !hoveredElement.el?.id) return false
        return el.id === hoveredElement.el.id && el.id !== draggedElement.id
    }

    const onUpdated = (val:any, id:number) => {
        bodyContentEls.find(el => el.id === id).value = val 
    }

    const onDuplicate = (id:number) => {
        const contentElementIndex: number = bodyContentEls.findIndex(el => el.id === id)
        const contentElement: ContentElement = bodyContentEls[contentElementIndex]
        bodyContentEls.splice(contentElementIndex, 0, contentElement)
    }

    const onDelete = (id:number) => {
        const contentElementIndex: number = bodyContentEls.findIndex(el => el.id === id)
        bodyContentEls.splice(contentElementIndex, 1)
    }

</script>

<template>
    <div class="composer">
        <div class="composer__content">

            <transition-group class="composer__content__body" name="flip-list" tag="div">
                <component  
                    v-for="(el, index) in bodyContentEls" 
                    :key="`tool-${el.id}`" 
                    :is="el.component" 
                    :id="el.id"
                    :class="['composer__tools__item', isOver(el) && 'composer__tools__item--over']"
                    v-bind="getAttributes(el.name)"
                    draggable="true"
                    @dragstart="onDragStart(el)" 
                    @dragend="onDragEnd(index, 'body')"
                    @dragover="onDragover(el, index)"
                    @doUpdate="onUpdated"
                    @doDuplicate="onDuplicate"
                    @doDelete="onDelete"
                />
            </transition-group>

        </div>
        <div class="composer__tools">
            <div 
                class="composer__tools__item" 
                v-for="(tool, index) in tools" 
                :key="`tool-${index}`" 
                draggable="true"
                @dragstart="onDragStart(tool)" 
                @dragend="onDragEnd(index, 'toolbar')"
            >{{ tool.name }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.composer {
    display: flex;

    $toolbar-with: 80px;

    &__content{
        background-color: #F7F7F7;
        flex:1 0 auto;
        padding: 6px;
    }

    &__content__body{
        text-align: left;
        border-radius: 8px;
        width: 400px;
        min-height: 400px;

        display: flex;
        flex-direction: column;
        gap: 4px;

        box-shadow: 2px 0px 12px -5px #ccc inset;
        background-color: #EFEFEF;
        padding: 8px;

        .composer__tools__item {
            border-radius: 8px;
            padding: 8px 16px;

            &--over {
                border: 1px dashed #999;
                opacity: 0.7;
            }
        }
    }

    &__tools {
        flex: 0 0 $toolbar-with;
        padding: 6px;

        display:flex;
        flex-direction: column;
        gap: 6px;

        background-color: #F7F7F7;

        .composer__tools__item {
            background-color: #FFF;
            border-radius: 8px;
            padding: 8px 2px;
            box-shadow: 2px 0px 12px -5px #ccc;
        }
    }
}
</style>