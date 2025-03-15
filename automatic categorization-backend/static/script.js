document.addEventListener("DOMContentLoaded", () => {
    // Handle image upload and expense categorization
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("fileInput");
            const formData = new FormData();
            formData.append("file", fileInput.files[0]);

            const response = await fetch("/extract-and-categorize", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            document.getElementById("output").textContent = JSON.stringify(result, null, 2);

            // Automatically fetch GST details if GST number is found
            if (result.gst_number) {
                document.getElementById("gstNumber").value = result.gst_number;
                document.getElementById("captcha").focus();
            }
        });
    }

    // Fetch GST captcha and display it
    async function fetchGstCaptcha() {
        const response = await fetch("/get-gst-captcha", {
            method: "GET",
        });

        const result = await response.json();
        if (result.code === 200) {
            const captchaImage = document.getElementById("captchaImage");
            if (captchaImage) {
                captchaImage.src = `/uploads/${result.data.captcha_image}`;
            }
            const captchaCookie = document.getElementById("captchaCookie");
            if (captchaCookie) {
                captchaCookie.value = result.data.captcha_cookie;
            }
        }
    }

    // Handle GST details fetch
    const gstForm = document.getElementById("gstForm");
    if (gstForm) {
        gstForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const gstNumber = document.getElementById("gstNumber").value;
            const captcha = document.getElementById("captcha").value;
            const captchaCookie = document.getElementById("captchaCookie").value;

            const response = await fetch("/fetch-gst-details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gst_number: gstNumber, captcha, captcha_cookie: captchaCookie }),
            });

            const result = await response.json();
            const gstOutput = document.getElementById("gstOutput");
            if (gstOutput) {
                gstOutput.textContent = JSON.stringify(result, null, 2);
            }

            // Update Google Maps iframe with the address
            if (result.data && result.data.address) {
                const address = encodeURIComponent(result.data.address);
                const iframe = document.getElementById("gmapIframe");
                if (iframe) {
                    iframe.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${address}`;
                }
            }
        });
    }

    // Fetch GST captcha on page load
    fetchGstCaptcha();
});