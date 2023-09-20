// Author: Jeff Hubert Orbeta (FN-FAL113)
// License: GNU General Public License v3.0
    
const regionSelectEl = document.querySelector('#region')
const provinceSelectEl = document.querySelector('#province')
const citySelectEl = document.querySelector('#city')
const barangaySelectEl = document.querySelector('#barangay')

function removeAllChildNodes(el) {
    while(el.firstChild) el.firstChild.remove()
}

async function loadRegions() {
    const res = await fetch('public/region.json')
    const jsonArr = await res.json()

    const regionOptions = jsonArr.map((obj) => `<option value="${obj.region_code}">${obj.region_name}</option>`)

    // append options to region selection
    regionSelectEl.append(document.createRange().createContextualFragment(regionOptions))
}

loadRegions()

regionSelectEl.onchange = async (e) => {
    const selected = regionSelectEl.options[regionSelectEl.options.selectedIndex]

    if(!selected.value) return

    try {
        const res = await fetch('public/province.json')
        const jsonArr = await res.json()

        const provinces = jsonArr.filter((obj) => obj.region_code === selected.value)
        const provincesOptions = provinces.map((obj) => `<option value="${obj.province_name}" data-province-code="${obj.province_code}">${obj.province_name}</option>`)
        
        // clear current children from various selections (fetus deletus)
        removeAllChildNodes(provinceSelectEl)
        removeAllChildNodes(citySelectEl)
        removeAllChildNodes(barangaySelectEl)

        // append options to province selection
        provinceSelectEl.append(document.createRange().createContextualFragment(provincesOptions))

        // due to region change, re-evaluate other address selection options
        await handleProvinceSelections()
        await handleCitySelections()
    } catch (error) {
        console.error("An error has occured on region selection")
    }
}

async function handleProvinceSelections() {
    const selected = provinceSelectEl.options[provinceSelectEl.options.selectedIndex]

    try {
        const res = await fetch('public/city.json')
        const jsonArr = await res.json()

        const cities = jsonArr.filter((obj) => obj.province_code === selected.dataset.provinceCode)
        const cityOptions = cities.map((obj) => `<option value="${obj.city_name}" data-city-code="${obj.city_code}">${obj.city_name}</option>`)

        // clear selection current children (fetus deletus)
        removeAllChildNodes(citySelectEl)

        // append options to city selection
        citySelectEl.append(document.createRange().createContextualFragment(cityOptions))

        // due to province change, re-evaluate barangay selection options
        await handleCitySelections()
    } catch (error) {
        console.error("An error has occured on province selection")
    }
} 

async function handleCitySelections() {
    const selected = citySelectEl.options[citySelectEl.options.selectedIndex]

    try {
        const res = await fetch('public/barangay.json')
        const jsonArr = await res.json()

        const barangays = jsonArr.filter((obj) => obj.city_code === selected.dataset.cityCode)
        const barangayOptions = barangays.map((obj) => `<option value="${obj.brgy_name}">${obj.brgy_name}</option>`)

        // clear selection current children (fetus deletus)
        removeAllChildNodes(barangaySelectEl)

        // append options to barangay selection
        barangaySelectEl.append(document.createRange().createContextualFragment(barangayOptions))
    } catch (error) {
        console.error("An error has occured on city selection")
        console.log(error)
    }
}

provinceSelectEl.onchange = handleProvinceSelections
citySelectEl.onchange = handleCitySelections
