document.getElementById("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const appName = document.getElementById("appName").value;
    const bundleId = document.getElementById("bundleId").value;
    const version = document.getElementById("version").value;
    const ipaFile = document.getElementById("ipaFile").files[0];

    if (!ipaFile) {
        alert("Please select an IPA file.");
        return;
    }

    // Create a FileReader to process the IPA file
    const reader = new FileReader();
    reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        JSZip.loadAsync(arrayBuffer).then(function (zip) {
            // Check for Info.plist in the IPA
            zip.file("Info.plist").async("string").then(function (plistData) {
                const plistObj = plist.parse(plistData); // Ensure plist.js has a 'parse' method
                const plistFilename = `${appName}.plist`;
                const ipaFilename = ipaFile.name;

                // Save Info.plist as a Blob
                const blob = new Blob([plistData], { type: "application/xml" });
                const plistUrl = URL.createObjectURL(blob);

                // Save IPA file locally (simulate storing it)
                const ipaUrl = URL.createObjectURL(ipaFile);

                // Display success message and navigate to dashboard
                alert("Upload successful!");

                // Store uploaded app info in local storage
                const uploadedApps = JSON.parse(localStorage.getItem("uploadedApps")) || [];
                uploadedApps.push({ appName, bundleId, version, plistUrl, ipaUrl });
                localStorage.setItem("uploadedApps", JSON.stringify(uploadedApps));

                // Redirect to dashboard.html
                window.location.href = "dashboard.html";
            });
        });
    };
    reader.readAsArrayBuffer(ipaFile);
});
