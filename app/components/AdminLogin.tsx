import { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface AdminLoginProps {
  onLogin: (role: 'admin' | 'volunteer') => void;
  onBack?: () => void;
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'volunteer'>('admin');

  // Demo credentials
  const credentials = {
    admin: { username: 'admin', password: 'admin123' },
    volunteer: { username: 'volunteer', password: 'vol123' },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      username === credentials[role].username &&
      password === credentials[role].password
    ) {
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      toast.success(
        `เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${
          role === 'admin' ? 'ผู้ดูแลระบ��' : 'อาสาสมัคร'
        }`
      );
      onLogin(role);
    } else {
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl text-white">เข้าสู่ระบบจัดการ</h1>
            <p className="text-sm text-white/80 mt-1">
              ศูนย์ช่วยเหลือผู้ประสบภัย
            </p>
          </div>

          {/* Form */}
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection */}
              <div>
                <Label>เข้าสู่ระบบในฐานะ</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setRole('admin')}
                    variant={role === 'admin' ? 'default' : 'outline'}
                    className="flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">ผู้ดูแลระบบ</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setRole('volunteer')}
                    variant={role === 'volunteer' ? 'default' : 'outline'}
                    className="flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">อาสาสมัคร</span>
                  </Button>
                </div>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="กรอกชื่อผู้ใช้"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน"
                    className="pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Info */}
              <Alert variant="default">
                <AlertDescription>
                  <p className="text-xs mb-2">ข้อมูลเข้าสู่ระบบทดสอบ:</p>
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong>ผู้ดูแลระบบ:</strong> admin / admin123
                    </div>
                    <div>
                      <strong>อาสาสมัคร:</strong> volunteer / vol123
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Login Button */}
              <Button type="submit" className="w-full">
                เข้าสู่ระบบ
              </Button>

              {/* Back Link */}
              <Button
                type="button"
                onClick={() => onBack?.()}
                variant="ghost"
                className="w-full"
              >
                กลับหน้าหลัก
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
