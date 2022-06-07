<template>
    <el-form-item :label="name" :label-width="wid">
        <el-select v-model="assessValue" placeholder="请选择评级" @change="$emit('input', assessValue)">
            <el-option v-for="item in assessList" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            :disabled="item.disabled">
            </el-option>
        </el-select>
    </el-form-item>
</template>

<script>
export default {
    name: 'costDriverAssess',
    props: ['name', 'wid', 'disableList'],
    data() {
        var assessList = [
            {
                value: 1,
                label: '很低',
                disabled: false
            },
            {
                value: 2,
                label: '低',
                disabled: false
            },
            {
                value: 3,
                label: '一般',
                disabled: false
            },
            {
                value: 4,
                label: '高',
                disabled: false
            },
            {
                value: 5,
                label: '很高',
                disabled: false
            },
            {
                value: 6,
                label: '非常高',
                disabled: false
            }
        ]
        for (let i = 0; i < this.disableList.length; i++) {
            assessList[this.disableList[i]].disabled = true
        }
        return {
            assessValue: '',
            assessList: assessList
        }
        
    },
    methods: {
        
    }

}
</script>