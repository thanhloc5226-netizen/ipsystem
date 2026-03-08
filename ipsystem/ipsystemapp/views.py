from django.shortcuts import render, redirect
from django.contrib import messages


def home(request):
    return render(request, 'ipsystemapp/home.html')


def about(request):
    return render(request, 'ipsystemapp/about.html')


def service(request):
    return render(request, 'ipsystemapp/service.html')


def portfolio(request):
    return render(request, 'ipsystemapp/portfolio.html')


def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        message_text = request.POST.get('message', '').strip()

        # TODO: Gửi email hoặc lưu vào database ở đây
        # Ví dụ:
        # Contact.objects.create(name=name, email=email, phone=phone, message=message_text)
        # send_mail(...)

        messages.success(request, f'Cảm ơn {name}! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại sớm nhất.')
        return redirect('contact')

    return render(request, 'ipsystemapp/contact.html')
