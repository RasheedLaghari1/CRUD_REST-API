//image controls with +, - and drop-down
import $ from "jquery";

export function zoomIn(scal) {
    $(".expand_it").removeClass("mm_pdf_img");
    $(".explore_img").removeClass("fit_top_bottom");

    let scaling = ''
    let dropdownZoomingValue = ''
    let zoom = ''
    switch (scal) {
        case 'scale(0.25)':
            scaling = "scale(0.35)"
            dropdownZoomingValue = { label: "10%", value: "10%" }
            zoom = "10%";
            break;
        case 'scale(0.35)':
            scaling = "scale(0.45)"
            dropdownZoomingValue = { label: "15%", value: "15%" }
            zoom = "15%";
            break;
        case 'scale(0.45)':
            scaling = "scale(0.55)"
            dropdownZoomingValue = { label: "20%", value: "20%" }
            zoom = "20%";
            break;
        case 'scale(0.55)':
            scaling = "scale(0.65)"
            dropdownZoomingValue = { label: "25%", value: "25%" }
            zoom = "25%";
            break;
        case 'scale(0.65)':
            scaling = "scale(0.75)"
            dropdownZoomingValue = { label: "30%", value: "30%" }
            zoom = "30%";
            break;
        case 'scale(0.75)':
            scaling = "scale(0.85)"
            dropdownZoomingValue = { label: "35%", value: "35%" }
            zoom = "35%";
            break;
        case 'scale(0.85)':
            scaling = "scale(0.95)"
            dropdownZoomingValue = { label: "40%", value: "40%" }
            zoom = "40%";
            break;
        case 'scale(0.95)':
            scaling = "scale(1)"
            dropdownZoomingValue = { label: "45%", value: "45%" }
            zoom = "45%";
            break;
        case 'scale(1)':
            scaling = "scale(1.1)"
            dropdownZoomingValue = { label: "50%", value: "50%" }
            zoom = "50%";
            break;
        case 'scale(1.1)':
            scaling = "scale(1.15)"
            dropdownZoomingValue = { label: "55%", value: "55%" }
            zoom = "55%";
            break;
        case 'scale(1.15)':
            scaling = "scale(1.25)"
            dropdownZoomingValue = { label: "60%", value: "60%" }
            zoom = "60%";
            break;
        case 'scale(1.25)':
            scaling = "scale(1.35)"
            dropdownZoomingValue = { label: "65%", value: "65%" }
            zoom = "65%";
            break;
        case 'scale(1.35)':
            scaling = "scale(1.45)"
            dropdownZoomingValue = { label: "70%", value: "70%" }
            zoom = "70%";
            break;
        case 'scale(1.45)':
            scaling = "scale(1.55)"
            dropdownZoomingValue = { label: "75%", value: "75%" }
            zoom = "75%";
            break;
        case 'scale(1.55)':
            scaling = "scale(1.65)"
            dropdownZoomingValue = { label: "80%", value: "80%" }
            zoom = "80%";
            break;
        case 'scale(1.65)':
            scaling = "scale(1.75)"
            dropdownZoomingValue = { label: "85%", value: "85%" }
            zoom = "85%";
            break;
        case 'scale(1.75)':
            scaling = "scale(1.85)"
            dropdownZoomingValue = { label: "90%", value: "90%" }
            zoom = "90%";
            break;
        case 'scale(1.85)':
            scaling = "scale(1.95)"
            dropdownZoomingValue = { label: "95%", value: "95%" }
            zoom = "95%";
            break;
        case 'scale(1.95)':
        case 'scale(2)':
            scaling = "scale(2)"
            dropdownZoomingValue = { label: "100%", value: "100%" }
            zoom = "100%";
            break;
    }

    return {
        scale: scaling,
        dropdownZoomingValue,
        zoom
    }
}
export function zoomOut(scal) {
    $(".expand_it").removeClass("mm_pdf_img");
    $(".explore_img").removeClass("fit_top_bottom");

    let scaling = ''
    let dropdownZoomingValue = ''
    let zoom = ''
    switch (scal) {
        case 'scale(0.35)':
        case 'scale(0.25)':
            scaling = "scale(0.25)"
            dropdownZoomingValue = { label: "5%", value: "5%" }
            zoom = "5%";
            break;
        case 'scale(0.45)':
            scaling = "scale(0.35)"
            dropdownZoomingValue = { label: "10%", value: "10%" }
            zoom = "10%";
            break;
        case 'scale(0.55)':
            scaling = "scale(0.45)"
            dropdownZoomingValue = { label: "15%", value: "15%" }
            zoom = "15%";
            break;
        case 'scale(0.65)':
            scaling = "scale(0.55)"
            dropdownZoomingValue = { label: "20%", value: "20%" }
            zoom = "20%";
            break;
        case 'scale(0.75)':
            scaling = "scale(0.65)"
            dropdownZoomingValue = { label: "25%", value: "25%" }
            zoom = "25%";
            break;
        case 'scale(0.85)':
            scaling = "scale(0.75)"
            dropdownZoomingValue = { label: "30%", value: "30%" }
            zoom = "30%";
            break;
        case 'scale(0.95)':
            scaling = "scale(0.85)"
            dropdownZoomingValue = { label: "35%", value: "35%" }
            zoom = "35%";
            break;
        case 'scale(1)':
            scaling = "scale(0.95)"
            dropdownZoomingValue = { label: "40%", value: "40%" }
            zoom = "40%";
            break;
        case 'scale(1.1)':
            scaling = "scale(1)"
            dropdownZoomingValue = { label: "45%", value: "45%" }
            zoom = "45%";
            break;
        case 'scale(1.15)':
            scaling = "scale(1.1)"
            dropdownZoomingValue = { label: "50%", value: "50%" }
            zoom = "50%";
            break;
        case 'scale(1.25)':
            scaling = "scale(1.15)"
            dropdownZoomingValue = { label: "55%", value: "55%" }
            zoom = "55%";
            break;
        case 'scale(1.35)':
            scaling = "scale(1.25)"
            dropdownZoomingValue = { label: "60%", value: "60%" }
            zoom = "60%";
            break;
        case 'scale(1.45)':
            scaling = "scale(1.35)"
            dropdownZoomingValue = { label: "65%", value: "65%" }
            zoom = "65%";
            break;
        case 'scale(1.55)':
            scaling = "scale(1.45)"
            dropdownZoomingValue = { label: "70%", value: "70%" }
            zoom = "70%";
            break;
        case 'scale(1.65)':
            scaling = "scale(1.55)"
            dropdownZoomingValue = { label: "75%", value: "75%" }
            zoom = "75%";
            break;
        case 'scale(1.75)':
            scaling = "scale(1.65)"
            dropdownZoomingValue = { label: "80%", value: "80%" }
            zoom = "80%";
            break;
        case 'scale(1.85)':
            scaling = "scale(1.75)"
            dropdownZoomingValue = { label: "85%", value: "85%" }
            zoom = "85%";
            break;
        case 'scale(1.95)':
            scaling = "scale(1.85)"
            dropdownZoomingValue = { label: "90%", value: "90%" }
            zoom = "90%";
            break;
        case 'scale(2)':
            scaling = "scale(1.95)"
            dropdownZoomingValue = { label: "95%", value: "95%" }
            zoom = "95%";
            break;
    }

    return {
        scale: scaling,
        dropdownZoomingValue,
        zoom
    }
}
export function handleDropdownZooming(scal) {
    $(".expand_it").removeClass("mm_pdf_img");
    $(".explore_img").removeClass("fit_top_bottom");

    let scaling = ''
    let dropdownZoomingValue = ''
    let zoom = ''
    switch (scal) {
        case '5%':
            scaling = "scale(0.25)"
            dropdownZoomingValue = { label: "5%", value: "5%" }
            zoom = "5%";
            break;
        case '10%':
            scaling = "scale(0.35)"
            dropdownZoomingValue = { label: "10%", value: "10%" }
            zoom = "10%";
            break;
        case '15%':
            scaling = "scale(0.45)"
            dropdownZoomingValue = { label: "15%", value: "15%" }
            zoom = "15%";
            break;
        case '20%':
            scaling = "scale(0.55)"
            dropdownZoomingValue = { label: "20%", value: "20%" }
            zoom = "20%";
            break;
        case '25%':
            scaling = "scale(0.65)"
            dropdownZoomingValue = { label: "25%", value: "25%" }
            zoom = "25%";
            break;
        case '30%':
            scaling = "scale(0.75)"
            dropdownZoomingValue = { label: "30%", value: "30%" }
            zoom = "30%";
            break;
        case '35%':
            scaling = "scale(0.85)"
            dropdownZoomingValue = { label: "35%", value: "35%" }
            zoom = "35%";
            break;
        case '40%':
            scaling = "scale(0.95)"
            dropdownZoomingValue = { label: "40%", value: "40%" }
            zoom = "40%";
            break;
        case '45%':
            scaling = "scale(1)"
            dropdownZoomingValue = { label: "45%", value: "45%" }
            zoom = "45%";
            break;
        case '50%':
            scaling = "scale(1.1)"
            dropdownZoomingValue = { label: "50%", value: "50%" }
            zoom = "50%";
            break;
        case '55%':
            scaling = "scale(1.15)"
            dropdownZoomingValue = { label: "55%", value: "55%" }
            zoom = "55%";
            break;
        case '60%':
            scaling = "scale(1.25)"
            dropdownZoomingValue = { label: "60%", value: "60%" }
            zoom = "60%";
            break;
        case '65%':
            scaling = "scale(1.35)"
            dropdownZoomingValue = { label: "65%", value: "65%" }
            zoom = "65%";
            break;
        case '70%':
            scaling = "scale(1.45)"
            dropdownZoomingValue = { label: "70%", value: "70%" }
            zoom = "70%";
            break;
        case '75%':
            scaling = "scale(1.55)"
            dropdownZoomingValue = { label: "75%", value: "75%" }
            zoom = "75%";
            break;
        case '80%':
            scaling = "scale(1.65)"
            dropdownZoomingValue = { label: "80%", value: "80%" }
            zoom = "80%";
            break;
        case '85%':
            scaling = "scale(1.75)"
            dropdownZoomingValue = { label: "85%", value: "85%" }
            zoom = "85%";
            break;
        case '90%':
            scaling = "scale(1.85)"
            dropdownZoomingValue = { label: "90%", value: "90%" }
            zoom = "90%";
            break;
        case '95%':
            scaling = "scale(1.95)"
            dropdownZoomingValue = { label: "95%", value: "95%" }
            zoom = "95%";
            break;
        case '100%':
            scaling = "scale(2)"
            dropdownZoomingValue = { label: "100%", value: "100%" }
            zoom = "100%";
            break;
    }

    return {
        scale: scaling,
        dropdownZoomingValue,
        zoom
    }
}