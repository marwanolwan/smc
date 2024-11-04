// scripts.js

// دالة عامة لجلب البيانات من API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل في تحميل البيانات من الخادم');
        return await response.json();
    } catch (error) {
        console.error('فشل في تحميل البيانات:', error);
        alert('حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى لاحقًا.');
    }
}

// جلب الأنشطة وعرضها
async function fetchActivities() {
    const activities = await fetchData('/api/admin/activities');
    if (activities) {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = activities.map(activity => 
            `<li>${activity.userId.email}: ${activity.action} في ${new Date(activity.timestamp).toLocaleString()}</li>`
        ).join('');
    }
}

// جلب المستخدمين وعرضهم
async function fetchUsers() {
    const users = await fetchData('/api/admin/users');
    if (users) {
        const userList = document.getElementById('user-list');
        userList.innerHTML = users.map(user => 
            `<p>${user.email} - ${user.role ? user.role.name : 'لا يوجد دور محدد'}</p>`
        ).join('');
    }
}

// جلب أداء المنشورات وعرضها
async function fetchPostPerformance() {
    const performances = await fetchData('/api/post-performance');
    if (performances) {
        const performanceList = document.getElementById('performance-list');
        performanceList.innerHTML = performances.map(performance => 
            `<li>المحتوى: ${performance.content} - إعجابات: ${performance.performance.likes} - تعليقات: ${performance.performance.comments} - مشاركات: ${performance.performance.shares}</li>`
        ).join('');
    }
}

// جلب توصيات الذكاء الاصطناعي وعرضها
async function fetchAIRecommendations() {
    const recommendations = await fetchData('/api/recommendations');
    const recommendationsDiv = document.getElementById('recommendations-result');
    recommendationsDiv.innerHTML = ''; // تنظيف المحتوى السابق

    if (recommendations && recommendations.length > 0) {
        recommendations.forEach(recommendation => {
            const p = document.createElement('p');
            p.textContent = recommendation;
            recommendationsDiv.appendChild(p);
        });
    } else {
        recommendationsDiv.textContent = 'لا توجد توصيات متاحة في الوقت الحالي.';
    }
}

// تشغيل الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([fetchActivities(), fetchUsers(), fetchPostPerformance()]);
});

// معالجة جدولة المنشور
const scheduleForm = document.getElementById('schedule-form');
if (scheduleForm) {
    scheduleForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const content = document.getElementById('content').value;
        const platform = document.getElementById('platform').value;
        const scheduledDate = document.getElementById('scheduledDate').value;

        try {
            const response = await fetch('/api/schedule-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, platform, scheduledDate })
            });

            if (response.ok) {
                alert('تمت جدولة المنشور بنجاح!');
                scheduleForm.reset();
            } else {
                alert('فشل في جدولة المنشور');
            }
        } catch (error) {
            console.error('فشل في جدولة المنشور:', error);
        }
    });
}

// جلب أفضل وقت للنشر
async function fetchBestTime() {
    const bestTime = await fetchData('/api/best-time');
    if (bestTime) {
        document.getElementById('best-time-result').innerText = `أفضل وقت للنشر هو الساعة: ${bestTime.hour}`;
    }
}

// جلب التقرير الشهري
async function fetchMonthlyReport() {
    const month = document.getElementById('report-month').value;
    const year = document.getElementById('report-year').value;

    try {
        const report = await fetchData(`/api/monthly-report?month=${month}&year=${year}`);
        if (report) {
            document.getElementById('report-result').innerHTML = `
                <p>عدد المنشورات: ${report.totalPosts}</p>
                <p>الإعجابات: ${report.totalLikes}</p>
                <p>التعليقات: ${report.totalComments}</p>
                <p>المشاركات: ${report.totalShares}</p>
            `;
        }
    } catch (error) {
        console.error('فشل في جلب التقرير الشهري:', error);
    }
}
