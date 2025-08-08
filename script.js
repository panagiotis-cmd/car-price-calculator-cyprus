let carData = {};

fetch('car_data.json')
    .then(response => response.json())
    .then(data => {
        carData = data;
        populateBrands();
    });

function populateBrands() {
    const brandSelect = document.getElementById('brand');
    brandSelect.innerHTML = '<option value="">Select Brand</option>';
    for (let brand in carData) {
        brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
    brandSelect.addEventListener('change', populateModels);
}

function populateModels() {
    const brand = document.getElementById('brand').value;
    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    document.getElementById('variant').innerHTML = '';
    document.getElementById('engine').value = '';
    document.getElementById('trim').innerHTML = '';

    for (let model in carData[brand]) {
        modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    }
    modelSelect.addEventListener('change', populateVariants);
}

function populateVariants() {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const variantSelect = document.getElementById('variant');
    variantSelect.innerHTML = '<option value="">Select Variant</option>';
    document.getElementById('engine').value = '';
    document.getElementById('trim').innerHTML = '';

    for (let variant in carData[brand][model]) {
        variantSelect.innerHTML += `<option value="${variant}">${variant}</option>`;
    }
    variantSelect.addEventListener('change', fillEngineAndTrims);
}

function fillEngineAndTrims() {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const variant = document.getElementById('variant').value;
    const data = carData[brand][model][variant];

    document.getElementById('engine').value = data.engine;

    const trimSelect = document.getElementById('trim');
    trimSelect.innerHTML = '';
    data.trims.forEach(trim => {
        trimSelect.innerHTML += `<option value="${trim}">${trim}</option>`;
    });
}

function calculatePrice() {
    let basePrice = 20000;
    const year = parseInt(document.getElementById('year').value);
    const mileage = parseInt(document.getElementById('mileage').value);
    const condition = document.getElementById('condition').value;
    const extras = document.querySelectorAll('input[type="checkbox"]:checked');

    // Depreciation
    const age = 2025 - year;
    basePrice -= age * 1000;
    basePrice -= (mileage / 10000) * 500;

    // Condition modifier
    const conditionModifiers = {
        excellent: 1.0,
        good: 0.9,
        fair: 0.8,
        poor: 0.7
    };
    basePrice *= conditionModifiers[condition];

    // Extras bonus
    basePrice += extras.length * 250;

    basePrice = Math.max(basePrice, 1000); // Minimum value

    document.getElementById('result').innerText = "Estimated Price: €" + basePrice.toFixed(2);
}
