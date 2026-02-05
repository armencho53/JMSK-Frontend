import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { fetchContacts, createContact, updateContact, deleteContact } from '../lib/api'
import { showSuccessToast, showErrorToast } from '../lib/toast'
import ContactFormModal from '../components/ContactFormModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Contact, ContactCreate, ContactUpdate } from '../types/contact'
import { Card, CardContent } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Table, TableColumn } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

// Define table columns for contacts
const getContactColumns = (
  onEdit: (contact: Contact) => void,
  onDelete: (contact: Contact) => void
): TableColumn<Contact>[] => [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-slate-900">{value}</span>
    )
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
    render: (value: string) => (
      <span className="text-slate-600">{value || '-'}</span>
    )
  },
  {
    key: 'phone',
    title: 'Phone',
    dataIndex: 'phone',
    render: (value: string) => value || '-',
    responsive: 'tablet'
  },
  {
    key: 'company',
    title: 'Company',
    dataIndex: 'company',
    sortable: true,
    render: (value: any) => (
      <span className="text-slate-900">{value?.name || '-'}</span>
    )
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'right' as const,
    width: 100,
    render: (_, record: Contact) => (
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          className="text-indigo-600 hover:text-slate-900"
          title="Edit contact"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
          className="text-red-600 hover:text-red-900"
          title="Delete contact"
        >
          Delete
        </button>
      </div>
    )
  }
]

export default function Contacts() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['contacts', searchQuery],
    queryFn: () => fetchContacts()
  })

  const createContactMutation = useMutation({
    mutationFn: (data: ContactCreate) => createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      showSuccessToast('Contact created successfully')
      setIsCreateModalOpen(false)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create contact'
      showErrorToast(message)
    }
  })

  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContactUpdate }) => 
      updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      showSuccessToast('Contact updated successfully')
      setIsEditModalOpen(false)
      setContactToEdit(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update contact'
      showErrorToast(message)
    }
  })

  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      showSuccessToast('Contact deleted successfully')
      setIsDeleteModalOpen(false)
      setContactToDelete(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete contact'
      showErrorToast(message)
    }
  })

  const handleCreateContact = (data: ContactCreate) => {
    createContactMutation.mutate(data)
  }

  const handleEditClick = (contact: Contact) => {
    setContactToEdit(contact)
    setIsEditModalOpen(true)
  }

  const handleUpdateContact = (data: ContactUpdate) => {
    if (contactToEdit) {
      updateContactMutation.mutate({
        id: contactToEdit.id,
        data
      })
    }
  }

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      deleteContactMutation.mutate(contactToDelete.id)
    }
  }

  const handleRowClick = (contactId: number) => {
    navigate(`/contacts/${contactId}`)
  }

  // Filter contacts by search query
  const filteredContacts = contacts?.filter(contact => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.company?.name?.toLowerCase().includes(query)
    )
  })

  // Define table columns
  const columns = getContactColumns(handleEditClick, handleDeleteClick);

  if (isLoading) {
    return (
      <Container size="full" padding="md">
        <Card variant="default">
          <CardContent className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-2 text-slate-600">Loading contacts...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="full" padding="md">
        <Card variant="outlined" className="border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-800">Error loading contacts. Please try again.</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="full" padding="md">
      <Toaster />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        > 
          Create Contact
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Card variant="elevated">
        <Table
          columns={columns}
          data={filteredContacts || []}
          loading={isLoading}
          hoverable
          responsive
          emptyText="No contacts found. Create your first contact to get started."
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            className: 'cursor-pointer'
          })}
        />
      </Card>

      <ContactFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreateContact}
        isSubmitting={createContactMutation.isPending}
      />

      <ContactFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setContactToEdit(null)
        }}
        mode="edit"
        contact={contactToEdit}
        onSubmit={handleUpdateContact}
        isSubmitting={updateContactMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setContactToDelete(null)
        }}
        itemName={contactToDelete?.name || ''}
        itemType="Contact"
        onConfirm={handleConfirmDelete}
        isDeleting={deleteContactMutation.isPending}
      />
    </Container>
  )
}
