<template>
  <div class="parent">
    <div class="win">
      <div class="win-head">
        <div class="win-title">Login form</div>
      </div>
      <div>
        <div class="form-control">
          <input type="text" id="email" v-model="email" required autocomplete = "off">
          <label for="email">Email</label>
          <ul class="error">
            <li v-for="item in emailErrors" v-if="item !== true">
              {{item}}
            </li>
          </ul> 
        </div>
        <div class="form-control">
          <input type="password" id="password" v-model="password" required autocomplete = "off">
          <label for="password">Password</label>
          <ul class="error">
            <li v-for="item in passwordErrors" v-if="item!==true">
              {{item}}
            </li>
          </ul> 
        </div>
        <div>  
          <button @click="submit">Login</button>
        </div>  
      </div>
    </div> 
  </div>  
</template> 

<script>
  export default {
    data () {
      return {
        email: 'sfriesen@jenkins.info',
        password: 'password_0',
        valid: false,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be at least 6 characters'
        ],
        emailErrors: [],
        passwordErrors: []
      }  
    },
    computed: {
    },
    methods: {
      validate (value, rules) {
        let errors = []
        rules.forEach(item => {
          errors.push(item(value))
        })
        return errors.every(function(v) {
          return v === true
        }) || errors
      },
      submit () {
        this.emailErrors = this.validate(this.email, this.emailRules)
        this.passwordErrors = this.validate(this.password, this.passwordRules)
        if (this.emailErrors === true && this.passwordErrors === true) {
          const user = {
            email: this.email,
            password: this.password
          }
          this.$store.dispatch('loginUser', user)
          .then(() => {
            this.$session.set('jwt', this.$store.getters.user)
            this.$router.push('/')  
          })
          .catch(err => {
            console.log(err)
          })
        }        
      }
    }
  }
</script>


<style scoped>
.parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  align-content: center; 
  justify-content: center; 
  overflow: auto;   
}
.win {
  background-color: wihte;
  box-shadow: 0 0 2px;
  border-radius: 2px;
  color: gray;
  margin: 5px 0px 2px 0px;
  padding:3px;
  max-width: 430px;
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


.form-control {
/*  display: inline-block; */
  font: 30pt  sans-serif;
  position: relative;
  margin: 5px 5px 0px 5px;
}
.form-control input {
  display: inline-block;
  border: 1px solid lightGray;
  color: gray;
  padding: 5px 25px 5px 5px;
  border-radius: 2px;
  font-size: 14px;
}
.form-control label {
  display: block;
  position: absolute;
  left: 15px;
  top: 22px;
  color: #aaa;
  font-size: 15px;
  -webkit-transition: .1s;
  transition: .1s;
}
.form-control input:valid + label,
.form-control input:focus + label {
  top: 0;
  font-size: 14px;
  color: gray;
}
button {
  min-width: 60px;
  margin: 4px 4px 10px 4px;
}
.error {
  font-size: 10px;
  color: gray;
}
</style>
