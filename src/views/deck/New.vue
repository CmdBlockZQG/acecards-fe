<template>
  <van-nav-bar
    title="新建卡组"
    left-text="返回"
    left-arrow
    @click-left="router.back()"
  />

  <div class="page-loading" v-if="loading">
    <van-loading color="#1989fa" size="50" />
  </div>

  <div class="container" v-else>
    <!--
    <span class="title">我的模板</span>
    <div class="item" v-for="i in template.private" :key="i.id">
      <div class="display">
        <b style="span-size: 1.1rem;">{{ i.name }}</b>
        <br>
        <span>内含{{ i.count }}张卡片</span>
      </div>
      <div class="button">
        <van-button round type="primary" style="width: 100%; height: 100%;" icon="plus" @click="showDialog(i)"></van-button>
      </div>
    </div>
    <van-divider />
    <span class="title">系统模板</span>
    -->
    <div class="item" v-for="i in template.public" :key="i.id">
      <div class="display">
        <b style="font-size: 1.1rem;">{{ i.name }}</b>
        <br>
        <span>内含{{ i.count }}张卡片</span>
      </div>
      <div class="button">
        <van-button round type="primary" style="width: 100%; height: 100%;" icon="plus" @click="showDialog(i)"></van-button>
      </div>
    </div>
  </div>

  <van-dialog v-model:show="dialog.show" title="新建卡组" show-cancel-button :before-close="submit">
    
    <div style="padding: 24px;">
      <span>以模板 <span style="color: #1989fa;">{{ dialog.t.name }}</span> 新建卡组</span>
      <van-form style="margin-top: 10px;" :disabled="dialog.lock">
        <van-field v-model="dialog.name" label="卡组名"></van-field>
        <van-field label="排序">
          <template #input>
            <van-radio-group v-model="dialog.ordered" direction="horizontal" :disabled="dialog.lock">
              <van-radio :name="'true'">顺序</van-radio>
              <van-radio :name="'false'">乱序</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-form>
    </div>
  </van-dialog>

</template>

<script setup>
  import { reactive, inject } from 'vue'
  import { useRouter } from 'vue-router'

  const Toast = inject('vant-toast')

  import axios from '../../plugins/axios.js'

  const router = useRouter()

  ref: loading = true
  const template = reactive({
    private: [],
    public: []
  })

  const dialog = reactive({
    show: false,
    t: { id: '', name: '' },
    ordered: 'true',
    name: '',
    lock: false
  })
  const showDialog = (t) => {
    dialog.ordered = 'true'
    dialog.name = t.name
    dialog.t = t
    dialog.lock = false
    dialog.show = true
  }
  const submit = async (action) => {
    if (action === 'cancel') {
      if (!dialog.lock) dialog.show = false
      return
    }
    if (!dialog.name) {
      Toast('请输入卡组名称')
      return
    }
    dialog.lock = true
    try {
      await axios.post('/deck', {
        name: dialog.name,
        template: dialog.t['_id'],
        ordered: dialog.ordered === 'true'
      })
    } finally {
      router.back()
    }
  }

  const init = async () => {
    try {
      const { data } = await axios.get('/template')
      for (const i of data) {
        if (i.user === '') template.public.push(i)
        else template.private.push(i)
      }
      loading = false
    } catch {
      router.back()
    }
  }

  init()

</script>

<style scoped>
  div.item {
    border-radius: 6px;
    border: solid #808080 1px;
    color: #4a4a4a;
    display: block;
    padding: 1rem;
    margin-bottom: 1.25rem;
    height: 3rem;
  }
  div.display {
    float: left;
    width: calc(100% - 3em - 4px);
  }
  div.button {
    float: right;
    width: 3em;
    height: 100%;
    border-radius: 6px;
  }
</style>