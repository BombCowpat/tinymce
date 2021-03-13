<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <Tinymce v-model="content1" id="t1" :height="300"></Tinymce>
      </el-col>
      <el-col :span="12">
        <Tinymce v-model="content2" id="t2" :height="300"></Tinymce>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <Tinymce v-model="content3" id="t3" :height="300"></Tinymce>
      </el-col>
      <el-col :span="12">
        <Tinymce v-model="content4" id="t4" :height="300"></Tinymce>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Tinymce from "./components/Tinymce";
export default {
  name: "App",
  data() {
    return {
      content1: "cyf1",
      content2: "cyf2",
      content3: "cyf3",
      content4: "cyf4",
    };
  },
  methods: {},
  components: {
    Tinymce,
  },
};
</script>

<style>
</style>
