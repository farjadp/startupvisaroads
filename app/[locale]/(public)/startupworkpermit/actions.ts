'use server'

export async function submitStartupRecoveryForm(formData: FormData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Telegram Env Variables Missing");
        return { success: false, message: "Server configuration error" };
    }

    const rawData = {
        fullName: formData.get('fullName'),
        teamName: formData.get('teamName'),
        phoneNumber: formData.get('phoneNumber'),
        email: formData.get('email'),
        isOurClient: formData.get('isOurClient'),
        otherProviderDesc: formData.get('otherProviderDesc'),
        designatedOrg: formData.get('designatedOrg'),
        prSubmitDate: formData.get('prSubmitDate'),
        wpSubmitDate: formData.get('wpSubmitDate'),
        wpRejectionDate: formData.get('wpRejectionDate'),
        hasOfficerNotes: formData.get('hasOfficerNotes'),
        officerNotesDesc: formData.get('officerNotesDesc'),
        file: formData.get('file') as File | null,
    }

    // Construct message
    let message = `
🚨 **New Startup Recovery Request**
----------------------------------
👤 **Name:** ${rawData.fullName}
🏢 **Team:** ${rawData.teamName}
📞 **Phone:** ${rawData.phoneNumber}
📧 **Email:** ${rawData.email}
----------------------------------
🤝 **Client Status:** ${rawData.isOurClient === 'yes' ? 'Existing Client' : 'New Lead'}
`;

    if (rawData.isOurClient === 'no') {
        message += `⚠️ **Provider Issue:** ${rawData.otherProviderDesc}\n`;
    }

    message += `
🏛 **Designated Org:** ${rawData.designatedOrg}
📅 **WP Submit:** ${rawData.wpSubmitDate || 'N/A'}
📅 **PR Submit:** ${rawData.prSubmitDate || 'N/A'}
`;

    if (rawData.wpRejectionDate) {
        message += `❌ **Rejection Date:** ${rawData.wpRejectionDate}\n`;
    }

    message += `----------------------------------
📝 **Officer Notes:** ${rawData.hasOfficerNotes === 'yes' ? 'Available' : 'Not Available'}
`;

    if (rawData.officerNotesDesc) {
        message += `💬 **Notes:** ${rawData.officerNotesDesc}\n`;
    }

    try {
        // 1. Send Text Message
        const textUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const textRes = await fetch(textUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                // parse_mode: 'Markdown', // Removed to avoid errors with special characters in user input
            }),
        });

        if (!textRes.ok) {
            const errorText = await textRes.text();
            console.error("Telegram Text Error:", errorText);
            throw new Error('Failed to send text message');
        }

        // 2. Send File (if exists)
        // Check if file is actually a file and has size
        if (rawData.file && rawData.file instanceof File && rawData.file.size > 0) {
            const fileFormData = new FormData();
            fileFormData.append('chat_id', chatId!);
            fileFormData.append('document', rawData.file);
            fileFormData.append('caption', `📂 Attached Officer Notes for ${rawData.teamName}`);

            const fileUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;
            const fileRes = await fetch(fileUrl, {
                method: 'POST',
                body: fileFormData,
            });

            if (!fileRes.ok) {
                const errorText = await fileRes.text();
                console.error("Telegram File Error:", errorText);
                throw new Error('Failed to send document');
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Telegram Error:", error);
        return { success: false, message: "Failed to send to Telegram" };
    }
}
