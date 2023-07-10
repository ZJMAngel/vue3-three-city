<template>
  <div class="home">
    <CityScene :eventList="eventList"/>
    <CityScreen :dataInfo="dataInfo" :eventList="eventList" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, Ref, ref } from 'vue'
import CityScene from '@/components/city/CityScene.vue'
import CityScreen from '@/components/city/CityScreen.vue' // @ is an alias to /src
import { IDataInfo } from './data'
import gsap from 'gsap'
import { getSmartCityInfo } from '@/api/api';

const dataInfo: IDataInfo = reactive({
  iot: { number: 0, name: '', unit: '' },
  event: { number: 0, name: '', unit: '' },
  power: { number: 0, name: '', unit: '' },
  test: { number: 0, name: '', unit: '' },
})
const eventList: Ref<any> = ref([])

const changeInfo = async () => {
  let res = await getSmartCityInfo()
  // console.log(res);
  // const { iot, event, power, test } = res.data.data
  // dataInfo.iot = iot
  // dataInfo.event = event
  // dataInfo.power = power
  // dataInfo.test = test
  let key: keyof IDataInfo
  for (key in dataInfo) {
    dataInfo[key].name = res.data.data[key].name
    dataInfo[key].unit = res.data.data[key].unit
    gsap.to(dataInfo[key], {
      number: res.data.data[key].number,
      duration: 1,
    })
  }

  // console.log(dataInfo);
}
const getEventList = async () => {
  let result = await getSmartCityList()
  eventList.value = result.data.list
  // console.log(result.data.list);
}

onMounted(async () => {
  changeInfo();
  getEventList();
  setInterval(() => {
    changeInfo();
    getEventList();
  }, 10000);
});
</script>
