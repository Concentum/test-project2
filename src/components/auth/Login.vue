<template>
  <div class="win">
    <div class="win-head">
      <div class="win-title">Login form</div>
    </div>
    <div>
      <input type="text">
      <input type="password">
      <button>Login</button>
    </div>
  </div> 
</template> 

<script>
  export default {
    data () {
      return {
        email: '',
        password: '',
        valid: fasle
      }  
    }
  }
</script>


<style scoped>
.win {
  background-color: wihte;
  box-shadow: 0 0 2px;
  border-radius: 2px;
  color: gray;
  margin: 5px 0px 2px 0px;
  padding:3px;
  min-width: 430px;
}
.win-head {
  border-radius: 2px;
  background-color: whiteSmoke;
  padding:3px;
}
.win-title {
  font: 12pt sans-serif;
  text-shadow: 0 1px white;
  width: 95%;
  display: inline;
  text-overflow: ellipsis;
}
.close_button {
  float: right;
  text-shadow: 0 1px white;
  cursor: pointer;
  margin-right: 3px;
}
</style>
