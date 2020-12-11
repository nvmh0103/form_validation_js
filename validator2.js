function Validator(options){
    var formRules={};
    function getParent(inputElement,selector){
        while (inputElement.parentElement){
            if (inputElement.parentElement.matches(selector))
            {
                return inputElement.parentElement;
            }
            inputElement=inputElement.parentElement;
        }
    }
    var validatorRules={
        required: function(value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function( value){
            var regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập lại email';
        },
        min: function(min){
            return function(value){
                return value.length>=min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        },
        confirm: function(value){
            return  value==options.getPassword() ? undefined :'Mật khẩu nhập lại không đúng';
        }
    };

    var formElement=document.querySelector(options.form);
    if (formElement)
    {
        var inputs=formElement.querySelectorAll('[name][rules]')
        for (var input of inputs)
        {
            var rules=input.getAttribute('rules').split('|');
            for (var rule of rules){
                var isRuleHasValue=rule.includes(':');
                var ruleInfo;
                if (isRuleHasValue){
                    var ruleInfo=rule.split(':');
                    rule=ruleInfo[0];
                }
                var ruleFunc=validatorRules[rule];
                if (isRuleHasValue)
                {
                    ruleFunc=ruleFunc(ruleInfo[1]);
                }
                if (Array.isArray(formRules[input.name]))
                {
                    formRules[input.name].push(ruleFunc);
                }
                else {
                    formRules[input.name]=[ruleFunc];
                }
            };
            // validate here
            input.onblur=handleValidate;
            input.oninput=handleClearError;
        }
        console.log(formRules);
        function handleValidate(event){
            var rules=(formRules[event.target.name]);
            var errorMessage;
            rules.some(function(rule){
                errorMessage=rule(event.target.value);
                return errorMessage;
            });
           // if false 
           if (errorMessage)
           {
            var  formGroup=getParent(event.target,'.form-group');
            formGroup.classList.add('invalid');
            if (formGroup)
            {
                var formMessage=formGroup.querySelector('.form-message');
                if (formMessage)
                {
                    formMessage.innerText=errorMessage;
                }
            }
           }
           return !errorMessage;
        }
        function handleClearError(event){
            var formGroup=getParent(event.target,'.form-group');
            if (formGroup.classList.contains('invalid'))
            {
                formGroup.classList.remove('invalid');
            }
            
            if (formGroup)
            {
                
                var formMessage=formGroup.querySelector('.form-message');
                if (formMessage)
                {
                    formMessage.innerText='';
                }
                
            }
        }
    }
    // submit solve
    formElement.onsubmit=function(event){
        event.preventDefault();
        var inputs=formElement.querySelectorAll('[name][rules]');
        var isValid=true;
        for (var input of inputs)
        {
            if (!handleValidate({target: input}))
                isValid=false;
        }
        if (isValid)
        {
            formElement.submit();
        }
    }

}

