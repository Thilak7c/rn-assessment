import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';
import { FormData } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  remarks?: string;
}

interface SubmitResult {
  success: boolean;
  id?: string;
  message: string;
}

export function FormScreen() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', remarks: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (result) setResult(null);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!form.remarks.trim()) {
      newErrors.remarks = 'Remarks are required.';
    } else if (form.remarks.trim().length < 10) {
      newErrors.remarks = 'Remarks must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await api.submitForm(form);
      setResult({
        success: true,
        id: res.id,
        message: `Submitted successfully! Record ID: ${res.id}`,
      });
      setForm({ name: '', email: '', remarks: '' });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Submission failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Submit a Request</Text>
            <Text style={styles.subtitle}>Fill in the details below and we'll get back to you.</Text>
          </View>

          {/* Result Banner */}
          {result && (
            <View style={[styles.resultBanner, result.success ? styles.successBanner : styles.errorBanner]}>
              <Text style={styles.resultEmoji}>{result.success ? '✅' : '❌'}</Text>
              <Text style={[styles.resultText, result.success ? styles.successText : styles.errorText]}>
                {result.message}
              </Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.card}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={form.name}
                onChangeText={(v) => updateField('name', v)}
                placeholder="John Doe"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {errors.name && <Text style={styles.errorMsg}>{errors.name}</Text>}
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Email Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                placeholder="john@example.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}
            </View>

            {/* Remarks */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Remarks <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textarea, errors.remarks ? styles.inputError : null]}
                value={form.remarks}
                onChangeText={(v) => updateField('remarks', v)}
                placeholder="Write your remarks here… (min. 10 characters)"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.charCount}>
                <Text style={[styles.charText, form.remarks.length < 10 ? styles.charWarn : styles.charOk]}>
                  {form.remarks.length} / 10 min
                </Text>
              </View>
              {errors.remarks && <Text style={styles.errorMsg}>{errors.remarks}</Text>}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  headerSection: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, lineHeight: 20 },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  successBanner: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' },
  errorBanner: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  resultEmoji: { fontSize: 18 },
  resultText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
  successText: { color: '#15803d' },
  errorText: { color: '#b91c1c' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  field: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required: { color: '#ef4444' },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  textarea: { height: 110, paddingTop: 12 },
  charCount: { alignItems: 'flex-end', marginTop: 4 },
  charText: { fontSize: 11 },
  charWarn: { color: '#94a3b8' },
  charOk: { color: '#22c55e' },
  errorMsg: { marginTop: 4, fontSize: 12, color: '#ef4444' },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    ...Platform.select({
      ios: { shadowColor: '#4f46e5', shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
