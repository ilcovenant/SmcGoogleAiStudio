/**
 * Utility functions for SMC Catalogo
 */
(() => {
    /**
     * Generates the image URL for a product variant
     * @param {string} id - Product ID
     * @param {string} color - Selected color name
     * @param {object} colorMap - Map of colors to suffixes
     * @returns {string} Image URL
     */
    const getImageUrl = (id, color, colorMap = window.COLOR_MAP) => {
        const suffix = colorMap?.[color]?.suffix || "_B";
        const safeId = id.replace(/\//g, '-');
        return `./images/${safeId}${suffix}.png`;
    };

    /**
     * Generates a WhatsApp link for a quote
     * @param {array} quoteItems - List of items in the quote
     * @returns {string} WhatsApp URL
     */
    const generateWhatsAppLink = (quoteItems) => {
        const intro = "Buongiorno SMC, vorrei richiedere un preventivo per i seguenti articoli:\n\n";
        const items = quoteItems.map(item => {
            const unitLabel = item.unit === "box" ? "Box" : "Conf.";
            const pzLabel = item.unit === "box" ? `(pz ${item.product.box * item.quantity})` : `(pz ${item.product.conf * item.quantity})`;
            return `- Art. ${item.product.id}: ${item.product.name} [Colore: ${item.color}] x ${item.quantity} ${unitLabel} ${pzLabel}`;
        }).join("\n");
        const text = encodeURIComponent(intro + items);
        return `https://wa.me/393662481736?text=${text}`;
    };

    /**
     * Generates an Email link for a quote
     * @param {array} quoteItems - List of items in the quote
     * @returns {string} Mailto URL
     */
    const generateEmailLink = (quoteItems) => {
        const subject = encodeURIComponent("Richiesta Preventivo - SMC Scribani");
        const intro = "Buongiorno SMC, vorrei richiedere un preventivo per i seguenti articoli:\n\n";
        const items = quoteItems.map(item => {
            const unitLabel = item.unit === "box" ? "Box" : "Conf.";
            const pzLabel = item.unit === "box" ? `(pz ${item.product.box * item.quantity})` : `(pz ${item.product.conf * item.quantity})`;
            return `- Art. ${item.product.id}: ${item.product.name} [Colore: ${item.color}] x ${item.quantity} ${unitLabel} ${pzLabel}`;
        }).join("\n");
        const body = encodeURIComponent(intro + items);
        return `mailto:scribani.mary@live.it?subject=${subject}&body=${body}`;
    };

    // Variabile globale per il logo pre-caricato
    let preloadedLogo = null;
    const preloadLogo = () => {
        const img = new Image();
        img.onload = () => { preloadedLogo = img; };
        img.onerror = () => { console.warn("Logo non pre-caricato"); };
        img.src = './logo.png';
    };
    preloadLogo();

    /**
     * Exports the quote to a PDF file
     * @param {array} quoteItems - List of items in the quote
     * @param {function} setIsPdfGenerating - State setter for loading state
     */
    const exportToPDF = async (quoteItems, setIsPdfGenerating) => {
        try {
            setIsPdfGenerating(true);
            
            if (!window.jspdf) {
                throw new Error("Libreria PDF non caricata.");
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            
            // Usiamo il logo pre-caricato (operazione sincrona)
            const logoImg = preloadedLogo;
            
            if (logoImg) {
                const imgProps = doc.getImageProperties(logoImg);
                const imgHeight = 15;
                const imgWidth = (imgProps.width * imgHeight) / imgProps.height;
                doc.setFillColor(0, 66, 157);
                doc.rect(10, 8, imgWidth + 8, imgHeight + 4, 'F');
                doc.addImage(logoImg, 'PNG', 14, 10, imgWidth, imgHeight);
            } else {
                doc.setFontSize(22);
                doc.setTextColor(0, 66, 157);
                doc.setFont("helvetica", "bold");
                doc.text("S.M.C. srl", 14, 22);
            }
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            const dateText = `Data: ${new Date().toLocaleDateString('it-IT')}`;
            doc.text(dateText, pageWidth - 14 - doc.getTextWidth(dateText), 20);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 66, 157);
            doc.setFont("helvetica", "bold");
            doc.text("Riepilogo Preventivo", 14, 35);
            
            const tableData = quoteItems.map(item => [
                item.product.id,
                item.product.name,
                item.color,
                `${item.quantity} ${item.unit === "box" ? "Box" : "Conf."}`,
                (item.unit === "box" ? item.quantity * item.product.box : item.quantity * item.product.conf).toString()
            ]);
            
            const tableConfig = {
                startY: 42,
                head: [['Codice', 'Prodotto', 'Colore', 'Quantità', 'Pezzi Totali']],
                body: tableData,
                styles: { font: "helvetica", fontSize: 9 },
                headStyles: { fillColor: [0, 66, 157], textColor: [255, 255, 255], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                margin: { top: 42 },
            };

            if (typeof doc.autoTable === 'function') {
                doc.autoTable(tableConfig);
            } else if (window.jspdf.jsPDF && typeof window.jspdf.jsPDF.autoTable === 'function') {
                window.jspdf.jsPDF.autoTable(doc, tableConfig);
            }
            
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 42;
            const footerY = finalY + 20;
            doc.setFontSize(10);
            doc.setTextColor(0, 66, 157);
            doc.setFont("helvetica", "bold");
            doc.text("www.smcsrl.eu", 14, footerY);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100);
            doc.text("|  Tel: +39 366 24 81 736", 14 + doc.getTextWidth("www.smcsrl.eu") + 5, footerY);
            
            const fileName = `Preventivo_SMC_${new Date().getTime()}.pdf`;
            
            // Rilevamento specifico per Firefox Standalone su Android
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            const isFirefoxAndroid = /Firefox/i.test(navigator.userAgent) && /Android/i.test(navigator.userAgent);

            // 1. Caso Critico: Firefox Standalone su Android
            // Questo browser ha un bug noto: non scarica i Blob in PWA. 
            // L'unica soluzione è il Data-URI (Base64), anche se più pesante.
            if (isStandalone && isFirefoxAndroid) {
                const dataUri = doc.output('datauristring');
                const link = document.createElement('a');
                link.href = dataUri;
                link.download = fileName;
                // Importante: in PWA Standalone, Firefox richiede che il link sia nel DOM
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    setIsPdfGenerating(false);
                }, 500);
                return;
            }

            // 2. Tentativo tramite Web Share API (Ideale per Chrome PWA e Mobile standard)
            if (navigator.canShare && navigator.canShare({ files: [new File([], 'test.pdf', {type: 'application/pdf'})] })) {
                try {
                    const pdfBlob = doc.output('blob');
                    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
                    await navigator.share({
                        files: [pdfFile],
                        title: 'Preventivo SMC',
                        text: 'Riepilogo preventivo SMC Scribani S.r.l.'
                    });
                    setIsPdfGenerating(false);
                    return;
                } catch (shareErr) {
                    if (shareErr.name !== 'AbortError') {
                        console.error("Errore condivisione:", shareErr);
                    } else {
                        setIsPdfGenerating(false);
                        return;
                    }
                }
            }
            
            // 3. Fallback Standard (Desktop o Chrome Mobile)
            doc.save(fileName);

        } catch (err) {
            console.error("Errore PDF:", err);
            alert("Errore durante la generazione del PDF: " + err.message);
        } finally {
            setIsPdfGenerating(false);
        }
    };

    // Expose to window for non-module script access
    window.SMC_UTILS = {
        getImageUrl,
        generateWhatsAppLink,
        generateEmailLink,
        exportToPDF
    };
})();
