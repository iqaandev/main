# Post 6, this week (checklist, bilingual EN+AR)

**Tip:** Tue-Thu 8-10am, personal profile. Attach `images/post6-cloud-bill.png`. Link in FIRST COMMENT if used.

---

A founder I know got a $2,300 cloud bill in month three. For an app with about 400 users.

Nothing was broken. Nothing was hacked. The app just did what it was built to do, in front of a pricing model nobody had read carefully. The scary part of cloud costs isn't failure, it's silence. Everything keeps working while the meter runs.

Five questions worth asking before that first invoice lands. Ten minutes total.

1. When does the free tier end? Not when it renews, when it ENDS. Most expire quietly, and the pricing after them is a different world. Put the date in your calendar with a reminder a week before.

2. What happens if traffic 10x overnight? Not hypothetically, your actual setup. Autoscaling usually has no ceiling unless you set one. Decide the ceiling before a good day on Hacker News decides it for you.

3. Where do the big files live? Storage is cheap. Moving it out again is egress, and egress is the silent line item that turns a $40 month into a $400 one. Nobody warns you because nobody at the provider loses money warning you.

4. Is the database always on? A modest managed database sitting idle 20 hours a day still bills for all 24. That's fine when it's $15. Check what it becomes after the promo.

5. Will anything tell me before the money leaves? A billing alert at 2x your expected spend, email plus phone if you can. Takes two minutes to set up and it is genuinely the highest ROI two minutes in this whole post.

None of this makes cloud expensive. Cloud is often the cheap option. These just make the bill boring, which is all a bill should ever be.

Save this for the week before launch.

What did your first surprise invoice look like? Real numbers welcome, this is a safe space.

#CloudComputing #Startups #SoftwareDevelopment

---

النسخة العربية:

مؤسس أعرفه وصلته فاتورة سحابية بـ 2300 دولار في الشهر الثالث. لتطبيق عدد مستخدميه 400 فقط.

لم يكن هناك خلل ولا اختراق. التطبيق فعل ما بُني ليفعله أمام نموذج تسعير لم يقرأه أحد بعناية. المخيف في تكاليف السحابة ليس الأعطال، بل الصمت. كل شيء يعمل بينما العدّاد يدور.

خمسة أسئلة قبل أن تصل فاتورتك الأولى:

متى تنتهي الطبقة المجانية فعلياً؟ ضع التاريخ في تقويمك.
ماذا يحدث لو تضاعف الزيارات عشر مرات فجأة؟ التوسّع التلقائي بلا سقف إلا لو حددته أنت.
أين تُخزن الملفات الكبيرة؟ التخزين رخيص، لكن إخراج البيانات هو البند الصامت الذي يحوّل فاتورة الـ 40 دولاراً إلى 400.
هل قاعدة البيانات تعمل على مدار الساعة؟ تحسب حتى وهي خاملة.
هل سينبهني أحد قبل خروج المال؟ فعّل تنبيهاً عند ضعف إنفاقك المتوقع. دقيقتان تستحقان أكثر من أي شيء في هذا المنشور.

السحابة ليست مكلفة، غالباً هي الخيار الأرخص. هذه الأسئلة تجعل الفاتورة مملة فقط. وهذه أفضل حالة للفواتير.

احفظ المنشور لأسبوع ما قبل الإطلاق.
