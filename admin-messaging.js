/* Smart Fitout customer messaging
   Keeps PDF/email flow untouched. WhatsApp uses Meta Cloud API when configured;
   otherwise it falls back to a pre-filled WhatsApp chat. RCS uses the Supabase
   Edge Function and requires RCS provider credentials there. */
async function sendCustomerMessage(channel){
  try{
    const {data:{user}}=await sb.auth.getUser();
    if(!user||user.email.toLowerCase()!==ADMIN_EMAIL){alert('Admin session expired. Please log in again.');return}
    const d=payload();
    if(!d.customer_name||!d.customer_mobile||!items.some(x=>x.description)){
      alert('Enter customer name, mobile number and at least one item/service.');return
    }
    await window.SF_PDF_LOGO_READY;
    const pdf=makePDF(d);
    const base64=pdf.output('datauristring').split(',')[1];
    const message=`Dear ${d.customer_name}, please find your Smart Fitout ${d.doc_type==='quotation'?'quotation':'invoice'} ${d.document_number}. Grand Total: ${money(d.total)}. Thank you for choosing Smart Fitout.`;
    if(channel==='whatsapp' && !window.SMART_FITOUT_WHATSAPP_API_ENABLED){
      const phone=d.customer_mobile.replace(/\D/g,'');
      const text=encodeURIComponent(message+' PDF: please use the PDF shared from the admin panel.');
      window.open('https://wa.me/'+phone+'?text='+text,'_blank');
      return
    }
    const {data,error}=await sb.functions.invoke('send-customer-message',{body:{channel,customer:{name:d.customer_name,mobile:d.customer_mobile,email:d.customer_email},document:{type:d.doc_type,number:d.document_number,total:d.total},message,pdf:{filename:(d.document_number||d.doc_type)+'.pdf',content:base64}}});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||('Could not send '+channel));
    alert('✅ '+(channel==='whatsapp'?'WhatsApp':'RCS')+' message sent to '+d.customer_mobile+'.');
  }catch(e){console.error(e);alert((channel==='whatsapp'?'WhatsApp':'RCS')+' error: '+(e.message||e))}
}
function sendWhatsApp(){return sendCustomerMessage('whatsapp')}
function sendRCS(){return sendCustomerMessage('rcs')}
