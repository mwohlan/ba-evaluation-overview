<script lang="ts" setup>
import { onMounted } from 'vue'
const route = useRoute()

const client = useSupabaseClient()

const user = useSupabaseUser()

const email = ref('')

const router = useRouter()

const password = ref('')

const pending = ref(false)

const buttonDisabled = ref(false)

const loading = ref(true)

const retryTime = ref(60)

const signIn = async () => {
  pending.value = true
  buttonDisabled.value = true
  const { error } = await client.auth.signIn({ email: email.value }, { redirectTo: `http://localhost:3000${route.query?.redirect}` })
  if (error)
    await client.auth.signUp({ email: email.value })

  pending.value = false
  const interval = setInterval(() => {
    retryTime.value--
    if (retryTime.value === 0) {
      buttonDisabled.value = false
      retryTime.value = 60
      clearInterval(interval)
    }
  }, 1000)
}

onMounted(async () => {
  setTimeout(() => {
    loading.value = false
  }, 700)
})
</script>

<template>
  <div h-screen flex justify-center items-center>
    <!-- <div v-if="route.query.redirect" self-center text-gray-700 w-14 h-14 i-eos-icons:loading /> -->
    <Transition enter-from-class="translate-x-20 op-0" leave-to-class="-translate-x-20 op-0" leave-active-class="duration-200" enter-active-class="duration-200" enter-to-class="translate-x-0 op-100" mode="out-in">
      <div v-if="!loading" py-5 px-5 space-y-4 bg-light-50 rounded-lg shadow-xl w-full max-w-md>
        <div class="relative w-full">
          <input id="email" v-model="email" type="email" required name="name" placeholder="your name" class="peer bg-white text-gray-600 transition-all w-full placeholder-transparent outline-none focus:outline-none border border-slate-200 focus:border-pink-400 rounded-md p-4">
          <label for="email" class="absolute z-[10] bg-light-50 left-2 px-2 -top-2 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 !peer-focus:-top-2 !peer-focus:text-gray-600 !peer-focus:text-xs">
            Email</label>
        </div>
        <div flex justify-end>
          <button mt-3 rounded disabled:cursor-not-allowed py-2 px-4 shadow-md font-medium text-gray-800 bg-gray-300 :disabled="buttonDisabled" @click="signIn">
            <div v-if="pending" disabled self-center text-gray-700 w-20 h-8 i-eos-icons:loading />
            <div v-else-if="buttonDisabled">
              Check your mail ({{ retryTime }}s)
            </div>
            <div v-else>
              Sign in
            </div>
          </button>
        </div>
      </div>

      <div v-else py-5 px-5 space-y-4 bg-light-50 rounded-lg shadow-xl w-full max-w-md>
        <div font-semibold text-4xl text-center>
          Redirecting...
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active  {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
}
</style>
