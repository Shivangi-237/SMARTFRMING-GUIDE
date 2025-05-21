document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle Functionality
    const langEnBtn = document.getElementById('lang-en');
    const langHiBtn = document.getElementById('lang-hi');
    
    langEnBtn.addEventListener('click', function() {
        toggleLanguage('en');
        langEnBtn.classList.add('active');
        langHiBtn.classList.remove('active');
    });
    
    langHiBtn.addEventListener('click', function() {
        toggleLanguage('hi');
        langHiBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    });
    
    function toggleLanguage(lang) {
        // Hide all language elements
        document.querySelectorAll('.en, .hi').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show elements for selected language
        document.querySelectorAll('.' + lang).forEach(el => {
            el.style.display = 'block';
        });
    }
    
    // Modal Functionality
    const diseaseCard = document.getElementById('disease-detection');
    const seedCard = document.getElementById('seed-identification');
    const diseaseModal = document.getElementById('disease-modal');
    const seedModal = document.getElementById('seed-modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Open modals when cards are clicked
    diseaseCard.addEventListener('click', function() {
        diseaseModal.style.display = 'block';
    });
    
    seedCard.addEventListener('click', function() {
        seedModal.style.display = 'block';
    });
    
    // Close modals when X is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            diseaseModal.style.display = 'none';
            seedModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === diseaseModal) {
            diseaseModal.style.display = 'none';
        }
        if (event.target === seedModal) {
            seedModal.style.display = 'none';
        }
    });
    
    // File upload functionality
    const diseaseUpload = document.querySelector('#disease-modal .upload-area');
    const seedUpload = document.querySelector('#seed-modal .upload-area');
    const diseaseInput = document.getElementById('disease-image');
    const seedInput = document.getElementById('seed-image');
    const analyzeDiseaseBtn = document.getElementById('analyze-disease');
    const identifySeedBtn = document.getElementById('identify-seed');
    const diseaseResult = document.getElementById('disease-result');
    const seedResult = document.getElementById('seed-result');
    
    diseaseUpload.addEventListener('click', function() {
        diseaseInput.click();
    });
    
    seedUpload.addEventListener('click', function() {
        seedInput.click();
    });
    
    diseaseInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            diseaseUpload.querySelector('p').textContent = fileName;
        }
    });
    
    seedInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            seedUpload.querySelector('p').textContent = fileName;
        }
    });
    
    // Mock analysis functions (replace with actual API calls)
    analyzeDiseaseBtn.addEventListener('click', function() {
        // Simulate API call delay
        diseaseUpload.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Analyzing image...</p>';
        
        setTimeout(function() {
            diseaseResult.style.display = 'block';
            document.getElementById('result-content').innerHTML = `
                <div class="result-item">
                    <h4 class="en">Disease Detected: Leaf Rust</h4>
                    <h4 class="hi" style="display:none">रोग का पता चला: पत्ती की जंग</h4>
                    <p class="en"><strong>Confidence:</strong> 92%</p>
                    <p class="hi" style="display:none"><strong>विश्वास:</strong> 92%</p>
                </div>
                <div class="result-item">
                    <h4 class="en">Recommended Treatment:</h4>
                    <h4 class="hi" style="display:none">अनुशंसित उपचार:</h4>
                    <p class="en">Apply fungicide containing chlorothalonil or mancozeb. Remove severely infected leaves.</p>
                    <p class="hi" style="display:none">क्लोरोथैलोनिल या मैंकोजेब युक्त कवकनाशी लगाएं। गंभीर रूप से संक्रमित पत्तियों को हटा दें।</p>
                </div>
            `;
            
            // Show elements in current language
            const currentLang = document.querySelector('.language-toggle button.active').id.split('-')[1];
            document.querySelectorAll(`.${currentLang}`).forEach(el => {
                el.style.display = 'block';
            });
        }, 2000);
    });
    
    identifySeedBtn.addEventListener('click', function() {
        // Simulate API call delay
        seedUpload.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Identifying seed...</p>';
        
        setTimeout(function() {
            seedResult.style.display = 'block';
            document.getElementById('seed-result-content').innerHTML = `
                <div class="result-item">
                    <h4 class="en">Seed Identified: Wheat (Triticum aestivum)</h4>
                    <h4 class="hi" style="display:none">बीज की पहचान: गेहूं (ट्रिटिकम एस्टिवम)</h4>
                    <p class="en"><strong>Confidence:</strong> 95%</p>
                    <p class="hi" style="display:none"><strong>विश्वास:</strong> 95%</p>
                </div>
                <div class="result-item">
                    <h4 class="en">Planting Information:</h4>
                    <h4 class="hi" style="display:none">रोपण जानकारी:</h4>
                    <p class="en">Best planted in cool seasons. Requires well-drained soil with pH 6.0-7.5.</p>
                    <p class="hi" style="display:none">ठंड के मौसम में लगाना सबसे अच्छा है। पीएच 6.0-7.5 के साथ अच्छी जल निकासी वाली मिट्टी की आवश्यकता होती है।</p>
                </div>
            `;
            
            // Show elements in current language
            const currentLang = document.querySelector('.language-toggle button.active').id.split('-')[1];
            document.querySelectorAll(`.${currentLang}`).forEach(el => {
                el.style.display = 'block';
            });
        }, 2000);
    });
    
    // Initialize Botpress Webchat
    window.botpressWebChat.init({
        composerPlaceholder: 'Ask your farming question...',
        botConversationDescription: 'Smart Farming Assistant',
        botId: 'ad810d05-2ab5-44c3-8c21-e5880c7504dc',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
        messagingUrl: 'https://messaging.botpress.cloud',
        clientId: 'ad810d05-2ab5-44c3-8c21-e5880c7504dc',
        webhookId: 'a9f4a2e3-7f9e-4c7d-9e5c-1e2d3f4e5d6f',
        lazySocket: true,
        themeName: 'prism',
        frontendVersion: 'v1',
        showPoweredBy: false,
        theme: {
            primaryColor: '#4CAF50',
            secondaryColor: '#388E3C',
            backgroundColor: '#ffffff'
        },
        disableAnimations: false,
        hideWidget: true,
        containerWidth: '350px',
        layoutWidth: '350px',
        showCloseButton: false,
    });
    
    // Custom button to open chat
    const chatButton = document.createElement('button');
    chatButton.innerHTML = '<i class="fas fa-robot"></i>';
    chatButton.style.position = 'fixed';
    chatButton.style.bottom = '20px';
    chatButton.style.left = '20px';
    chatButton.style.width = '60px';
    chatButton.style.height = '60px';
    chatButton.style.borderRadius = '50%';
    chatButton.style.backgroundColor = '#4CAF50';
    chatButton.style.color = 'white';
    chatButton.style.border = 'none';
    chatButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    chatButton.style.cursor = 'pointer';
    chatButton.style.fontSize = '24px';
    chatButton.style.zIndex = '999';
    chatButton.addEventListener('click', function() {
        window.botpressWebChat.sendEvent({ type: 'show' });
    });
    
    document.body.appendChild(chatButton);
});
