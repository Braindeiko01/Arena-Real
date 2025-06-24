
"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { ShieldIcon as ClashTagIcon, Edit3, Save, Link as LinkIcon, User as UserLucideIcon } from 'lucide-react';
import { NequiIcon, PhoneIcon, UserIcon as AppUserIcon } from '@/components/icons/ClashRoyaleIcons';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';

const ProfilePageContent = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    username: user?.username || '',
    clashTag: user?.clashTag || '',
    nequiAccount: user?.nequiAccount || '',
    avatarUrl: user?.avatarUrl || '',
    friendLink: user?.friendLink || '',
  });

  if (!user) return <p>Cargando perfil...</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (formData.friendLink && !/^https:\/\/link\.clashroyale\.com\/invite\/friend\/es\?tag=[0289PYLQGRJCUV]{3,}&token=[a-z0-9]+&platform=(android|ios)$/.test(formData.friendLink)) {
        toast({ title: "Error", description: "El formato del link de amigo de Clash Royale es inválido.", variant: "destructive" });
        return;
      }

      if (formData.nequiAccount && !/^\d{7,}$/.test(formData.nequiAccount)) {
        toast({ title: "Error", description: "El número de teléfono Nequi debe tener al menos 7 dígitos y solo contener números.", variant: "destructive" });
        return;
      }

      if (formData.clashTag && formData.nequiAccount && formData.username) { // Username added to condition
        updateUser({
          username: formData.username, // Username is part of user data but not editable in this form
          clashTag: formData.clashTag,
          nequiAccount: formData.nequiAccount,
          avatarUrl: formData.avatarUrl || user.avatarUrl,
          friendLink: formData.friendLink || '',
        });
        toast({ title: "¡Perfil Actualizado!", description: "Tus cambios han sido guardados.", variant: "default" });
      } else {
        toast({ title: "Error", description: "Los campos de Tag y Número de teléfono Nequi no pueden estar vacíos.", variant: "destructive" });
        setFormData({ username: user.username, clashTag: user.clashTag, nequiAccount: user.nequiAccount, avatarUrl: user.avatarUrl, friendLink: user.friendLink });
      }
    } else {
      setFormData({ username: user.username, clashTag: user.clashTag, nequiAccount: user.nequiAccount, avatarUrl: user.avatarUrl, friendLink: user.friendLink || '' });
    }
    setIsEditing(!isEditing);
  };

  const InfoRow = ({ icon, label, value, name, editingValue, onChange, isEditing, type = "text", placeholder, description, readOnly = false }: { icon: React.ReactNode, label: string, value: string, name?: string, editingValue?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, isEditing?: boolean, type?: string, placeholder?: string, description?: string, readOnly?: boolean }) => (
    <div className="flex items-start space-x-4 py-3 border-b border-border last:border-b-0">
      <div className="flex-shrink-0 w-8 h-8 text-primary flex items-center justify-center pt-1">{icon}</div>
      <div className="flex-grow">
        <p className="text-sm text-muted-foreground">{label}</p>
        {isEditing && name && onChange && !readOnly ? (
          <>
            <Input
              type={type}
              name={name}
              value={editingValue}
              onChange={onChange}
              placeholder={placeholder}
              className="text-lg font-semibold border-2 focus:border-accent py-2 mt-1"
              readOnly={readOnly}
            />
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </>
        ) : (
          <p className="text-lg font-semibold text-foreground break-all mt-0.5">{value || "-"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-card-medieval border-2 border-primary-dark overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-6">
          <Avatar className="h-32 w-32 mx-auto border-4 border-accent shadow-lg mb-4">
            <AvatarImage src={isEditing ? formData.avatarUrl : user.avatarUrl || `https://placehold.co/128x128.png?text=${user.username?.[0]?.toUpperCase() || 'U'}`} alt={user.username} data-ai-hint="gaming avatar large" />
            <AvatarFallback className="text-5xl bg-primary/30 text-primary-foreground">{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          {isEditing ? (
            <>
              <Input
                name="username" // This will be displayed but not part of the editable form fields controlled by 'isEditing' logic above for now.
                value={formData.username} // Display current username
                readOnly // Username is not editable
                className="text-center text-2xl font-headline text-primary border-2 focus:border-accent py-2 mt-2 bg-muted/50 cursor-not-allowed"
              />
              <Input
                name="avatarUrl"
                placeholder="URL del Avatar (ej. https://placehold.co/128x128.png)"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                className="text-center text-sm font-semibold border-2 focus:border-accent py-2 mt-2"
              />
            </>
          ) : (
            <CardTitle className="text-4xl font-headline text-primary">{user.username}</CardTitle>
          )}
          <CardDescription className="text-muted-foreground mt-1 text-lg">Administra tu identidad en CR Duels.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <InfoRow icon={<AppUserIcon />} label="Nombre de Usuario" value={user.username} name="username" editingValue={formData.username} isEditing={isEditing} readOnly={true} />
          <InfoRow icon={<PhoneIcon />} label="Teléfono Registrado (Principal)" value={user.phone} readOnly={true} />
          <InfoRow
            icon={<NequiIcon />}
            label="Número de teléfono enlazado con Nequi"
            value={isEditing && formData.nequiAccount ? formData.nequiAccount : user.nequiAccount}
            name="nequiAccount"
            editingValue={formData.nequiAccount}
            onChange={handleInputChange}
            isEditing={isEditing}
            placeholder="Tu número de Nequi"
            description="Este es el número donde recibirás/enviarás pagos."
          />
          <InfoRow
            icon={<ClashTagIcon />}
            label="Tag de Clash Royale"
            value={isEditing && formData.clashTag ? formData.clashTag : user.clashTag}
            name="clashTag"
            editingValue={formData.clashTag}
            onChange={handleInputChange}
            isEditing={isEditing}
            placeholder="Tu Tag de jugador"
          />
          <InfoRow
            icon={<LinkIcon />}
            label="Link de Amigo Clash Royale"
            value={isEditing && formData.friendLink ? formData.friendLink : (user.friendLink || "No establecido")}
            name="friendLink"
            editingValue={formData.friendLink}
            onChange={handleInputChange}
            isEditing={isEditing}
            placeholder="https://link.clashroyale.com/..."
            description="Necesario para invitar a duelos."
          />
          <div className="flex items-center space-x-4 py-3">
            <div className="flex-shrink-0 w-8 h-8 text-primary flex items-center justify-center">💰</div>
            <div className="flex-grow">
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className="text-lg font-semibold text-accent">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6">
          <CartoonButton
            onClick={handleEditToggle}
            variant={isEditing ? "accent" : "default"}
            className="w-full"
            iconLeft={isEditing ? <Save /> : <Edit3 />}
          >
            {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
          </CartoonButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <AppLayout>
      <ProfilePageContent />
    </AppLayout>
  );
}
