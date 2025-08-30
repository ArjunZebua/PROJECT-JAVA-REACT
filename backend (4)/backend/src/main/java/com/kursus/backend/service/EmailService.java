package com.kursus.backend.service;


import com.kursus.backend.model.User;
import com.kursus.backend.model.Course;
import com.kursus.backend.model.Enrollment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@SuppressWarnings("unused")
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    private static final String FROM_EMAIL = "noreply@kursus.com";
    
    public void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Selamat Datang di Platform Kursus!");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Selamat datang di platform kursus online kami!\n" +
            "Akun Anda telah berhasil dibuat dengan email: %s\n\n" +
            "Anda dapat mulai menjelajahi berbagai kursus yang tersedia.\n\n" +
            "Terima kasih,\n" +
            "Tim Kursus Online",
            user.getFullName(), user.getEmail()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't throw exception
            System.err.println("Failed to send welcome email to: " + user.getEmail());
        }
    }
    
    public void sendAccountUpdateNotification(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Informasi Akun Diperbarui");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Informasi akun Anda telah berhasil diperbarui.\n" +
            "Jika Anda tidak melakukan perubahan ini, segera hubungi tim support kami.\n\n" +
            "Terima kasih,\n" +
            "Tim Kursus Online",
            user.getFullName()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send update notification to: " + user.getEmail());
        }
    }
    
    public void sendAccountDeactivationNotification(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Akun Dinonaktifkan");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Akun Anda telah dinonaktifkan.\n" +
            "Jika Anda memerlukan bantuan, silakan hubungi tim support kami.\n\n" +
            "Terima kasih,\n" +
            "Tim Kursus Online",
            user.getFullName()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send deactivation notification to: " + user.getEmail());
        }
    }
    
    public void sendAccountReactivationNotification(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Akun Diaktifkan Kembali");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Akun Anda telah diaktifkan kembali.\n" +
            "Anda dapat kembali mengakses semua fitur platform kami.\n\n" +
            "Terima kasih,\n" +
            "Tim Kursus Online",
            user.getFullName()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send reactivation notification to: " + user.getEmail());
        }
    }
    
    public void sendCourseEnrollmentNotification(User user, Course course) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Pendaftaran Kursus Berhasil");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Selamat! Anda telah berhasil mendaftar untuk kursus:\n" +
            "Judul: %s\n" +
            "Kategori: %s\n\n" +
            "Anda dapat mulai mengakses materi kursus melalui dashboard Anda.\n\n" +
            "Selamat belajar!\n" +
            "Tim Kursus Online",
            user.getFullName(), course.getTitle(), course.getCategory().getName()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send enrollment notification to: " + user.getEmail());
        }
    }
    
    public void sendCourseCompletionNotification(User user, Course course) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Selamat! Kursus Selesai");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Selamat! Anda telah menyelesaikan kursus:\n" +
            "Judul: %s\n\n" +
            "Sertifikat penyelesaian akan segera tersedia di dashboard Anda.\n\n" +
            "Terima kasih telah belajar bersama kami!\n" +
            "Tim Kursus Online",
            user.getFullName(), course.getTitle()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send completion notification to: " + user.getEmail());
        }
    }
    
    public void sendNewCourseNotification(User user, Course course) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Kursus Baru Tersedia!");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Ada kursus baru yang mungkin menarik untuk Anda:\n" +
            "Judul: %s\n" +
            "Kategori: %s\n" +
            "Deskripsi: %s\n\n" +
            "Jangan lewatkan kesempatan untuk mengembangkan skill Anda!\n\n" +
            "Terima kasih,\n" +
            "Tim Kursus Online",
            user.getFullName(), course.getTitle(), 
            course.getCategory().getName(), course.getDescription()
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send new course notification to: " + user.getEmail());
        }
    }
    
    public void sendPaymentSuccessNotification(User user, Course course, String transactionId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(user.getEmail());
        message.setSubject("Pembayaran Berhasil");
        
        String text = String.format(
            "Halo %s,\n\n" +
            "Pembayaran Anda telah berhasil diproses!\n" +
            "Kursus: %s\n" +
            "ID Transaksi: %s\n\n" +
            "Anda sekarang dapat mengakses materi kursus.\n\n" +
            "Terima kasih,\n" +
            "Tim Kursus Online",
            user.getFullName(), course.getTitle(), transactionId
        );
        
        message.setText(text);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send payment success notification to: " + user.getEmail());
        }
    }
}
