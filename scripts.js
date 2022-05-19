// Variáveis globais

const INPUTS = {
    CEP: document.getElementById('cep'),
    RUA: document.getElementById('rua'),
    BAIRRO: document.getElementById('bairro'),
    CIDADE: document.getElementById('cidade'),
    UF: document.getElementById('uf'),
    IBGE: document.getElementById('ibge'),
    DDD: document.getElementById('ddd'),
}


// Funções

const verifyInputs = event => {
    formIsValid = true;

    Object.values(INPUTS).forEach(input => {
        if (!input.value) {
            formIsValid = false;

            if (event?.target == input) invalidate(input)
        } else if (!event) {
            input.parentElement.classList.remove('invalid');
            input.parentElement.classList.add('valid');
        }
    })

    document.getElementById('submit-button').disabled = !formIsValid;
}

const invalidate = inputDOMElement => {
    inputDOMElement.parentElement.classList.remove('valid');
    inputDOMElement.parentElement.classList.add('invalid');
    document.getElementById('submit-button').disabled = true;
}

const resetForm = () => {
    Object.values(INPUTS).forEach(input => {
        input.value = '';
        input.parentElement.classList.remove('valid');
        input.parentElement.classList.remove('invalid');
    });

    document.getElementById('submit-button').disabled = true;
    alert("Submitted successfully!")
}

const removeValidationClasses = event => {
    event.target.parentElement.classList.remove('valid');
    event.target.parentElement.classList.remove('invalid');
};

const maskCep = value => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/g, "$1-$2");
    INPUTS.CEP.value = value;
}

const allowOnlyNumbers = input => {
    input.value = input.value.replace(/[^0-9+.-]/g, '').replace(/(\..*?)\..*/g, '$1');
}

const validateCep = cep => /^[0-9]{5}-[0-9]{3}$/.test(cep);

const getAdress = async cep => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        mode: "cors",
        method: 'GET'
    });

    return await response.json();
}

const onCepBlurHandler = async (event) => {
    const newCep = event.target.value;

    if (!validateCep(newCep)) {
        invalidate(INPUTS.CEP);
        return;
    }

    document.getElementById('form').classList.add('is-loading');

    try {
        const data = await getAdress(newCep);
        if (data.erro === 'true') throw new Error();

        INPUTS.RUA.value = data.logradouro;
        INPUTS.BAIRRO.value = data.bairro;
        INPUTS.CIDADE.value = data.localidade;
        INPUTS.UF.value = data.uf;
        INPUTS.IBGE.value = data.ibge;
        INPUTS.DDD.value = data.ddd;

        verifyInputs();
    } catch (err) {
        invalidate(INPUTS.CEP);
    }

    document.getElementById('form').classList.remove('is-loading');
}

document.getElementById('form').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        return false;
    }
})

Object.values(INPUTS).forEach(input => {
    input.addEventListener('blur', verifyInputs);
    input.addEventListener('focus', removeValidationClasses);
});
INPUTS.CEP.addEventListener('keypress', event => maskCep(event.target.value));
INPUTS.CEP.addEventListener('change', event => maskCep(event.target.value));