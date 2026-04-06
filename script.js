class ExamScoreRecorder {
    constructor() {
        this.records = JSON.parse(localStorage.getItem('examRecords')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderRecords();
        this.updateStats();
    }

    bindEvents() {
        document.getElementById('scoreForm').addEventListener('submit', (e) => this.addRecord(e));
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
    }

    addRecord(e) {
        e.preventDefault();
        
        const studentName = document.getElementById('studentName').value.trim();
        const studentId = document.getElementById('studentId').value.trim();
        const subject = document.getElementById('subject').value;
        const score = parseInt(document.getElementById('score').value);

        if (!studentName || !subject || isNaN(score) || score < 0 || score > 100) {
            alert('Please fill all required fields with valid data (Score: 0-100)');
            return;
        }

        const record = {
            id: Date.now(),
            studentName,
            studentId,
            subject,
            score,
            date: new Date().toLocaleDateString(),
            grade: this.calculateGrade(score)
        };

        this.records.unshift(record);
        this.saveRecords();
        this.renderRecords();
        this.updateStats();
        this.clearForm();
    }

    calculateGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        return 'F';
    }

    renderRecords() {
        const container = document.getElementById('recordsContainer');
        
        if (this.records.length === 0) {
            container.innerHTML = '<div class="no-records">No records yet. Add your first student score!</div>';
            return;
        }

        container.innerHTML = `
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.records.slice(0, 10).map(record => `
                        <tr>
                            <td>${record.studentName}</td>
                            <td>${record.studentId || '-'}</td>
                            <td>${record.subject}</td>
                            <td><strong>${record.score}</strong></td>
                            <td><span class="grade grade.${record.grade}">${record.grade}</span></td>
                            <td>${record.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${this.records.length > 10 ? `<p style="text-align: center; color: #666; margin-top: 15px;">Showing 10 most recent of ${this.records.length} total records</p>` : ''}
        `;
    }

    updateStats() {
        const totalStudents = this.records.length;
        const totalScore = this.records.reduce((sum, record) => sum + record.score, 0);
        const avgScore = totalStudents ? (totalScore / totalStudents).toFixed(1) : 0;
        const highestScore = Math.max(...this.records.map(r => r.score), 0);
        const passRate = totalStudents ? ((this.records.filter(r => r.score >= 70).length / totalStudents) * 100).toFixed(1) : 0;

        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('avgScore').textContent = avgScore;
        document.getElementById('highestScore').textContent = highestScore || 0;
        document.getElementById('passRate').textContent = passRate + '%';
    }

    clearForm() {
        document.getElementById('scoreForm').reset();
    }

    clearAll() {
        if (confirm('Are you sure you want to delete ALL records? This cannot be undone.')) {
            this.records = [];
            this.saveRecords();
            this.renderRecords();
            this.updateStats();
        }
    }

    saveRecords() {
        localStorage.setItem('examRecords', JSON.stringify(this.records));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExamScoreRecorder();
});