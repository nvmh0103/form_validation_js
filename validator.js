function Validator(options){
    function getParent(inputElement,selector){
        while (inputElement.parentElement){
            if (inputElement.parentElement.matches(selector))
            {
                return inputElement.parentElement;
            }
            inputElement=inputElement.parentElement;
        }


    }
    function validate(inputElement,rule){
        var errorMessage;
        var errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var rules=selectorRules[rule.selector];
        for (var i=0;i<rules.length;i++)
        {
            errorMessage=rules[i](inputElement.value);
            if (errorMessage)
                break;
        }
        if (errorMessage)
        {
             errorElement.innerText=errorMessage;
             getParent(inputElement,options.formGroupSelector).classList.add('invalid');
        }
        else {
            errorElement.innerText='';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
        }   

        return !errorMessage;
    }
    var selectorRules={};

    var formElement=document.querySelector(options.form);
    if (formElement)
    {
        formElement.onsubmit=function(e){
            e.preventDefault(); 
            var isFormValid= true;
            options.rules.forEach(function (rule){
                var inputElement=formElement.querySelector(rule.selector);
                var isValid=validate(inputElement,rule);
                if (!isValid)
                    isFormValid=false;
            });
            if (isFormValid){
                if (typeof options.onSubmit==='function')
                var formInputs=formElement.querySelectorAll('[name]')
                var formValues=Array.from(formInputs).reduce(function(values,input){
                    (values[input.name]=input.value)
                    return values; 
                
                },{})
                options.onSubmit(formValues);
            }
        }
    }
        // loop & process rules
        options.rules.forEach(function(rule){
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            else
                selectorRules[rule.selector]=[rule.test];
            var inputElement=formElement.querySelector(rule.selector);
            var errorElement=inputElement.parentElement.querySelector('.form-message');
            if (inputElement){

                inputElement.onblur=function()
                {
                    validate(inputElement,rule);
                }
                // mỗi khi nhập lại 
                inputElement.oninput=function(){
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerText='';
                }
            }
        })
    }
Validator.isRequired=function(selector){
    return{
        selector:selector,
        test:function(value){
            return value.trim() ? undefined:'Vui lòng nhập lại trường này';
        }
    }
}
Validator.isEmail=function(selector){
    return{
        selector:selector,
        test:function(value){
            var regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập lại email';
            
        }
    }
}
Validator.minLength=function(selector,min){
    return {
        selector:selector,
        test:function(value){
            return value.length>=min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự `;
        }
    }
}
Validator.isPasswordConfirm=function(selector,password,message){
    return {
        selector:selector,
        test:function(value){
            return value.trim()===password() ? undefined : message || 'Vui lòng nhập lại mật khẩu';
        }
    }
}