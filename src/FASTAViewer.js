import React, { useState, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Upload, ArrowDown, ArrowUp, Trash2, ChevronsDown } from 'lucide-react';

const FASTAViewer = () => {
    const [sequences, setSequences] = useState([]);
    const [highlightedColumns, setHighlightedColumns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const sequenceWidth = 60;
    const fileInputRef = useRef(null);

    const demoData = `
AtCHI --------------------------------------------------------------------------------
AtCHIL --------------------------------------------------------------------------------
AANG008676 -----------------------------------MSECCRYAK------------------------------------
AANG002262 --ML------------MWTGTSPRPTHWQR----------------------NGTQIFSLWCTAE---------------
AANG012888 MVQL------------VWSVESGGFISGSRSVSKQRSGCLAGAG--------QACLISSKGCISRQ-----------ELL
AANG013146 MFVLDPRHARLDFGPDLWDLL--FLPHLSNVHAWYKAECAKLAAHSARKELLDKLYQETLDDNTRQYAQYYRDRLKEDRD
AANG002615 -----------------------MFSTGS-------SVCVSSAGVDD----PLATFVEEVACRSP---------------
AANG010420 --------------------------------------------------------------------------------
AANG000786 -----------------------------------------------------------MAQTG----------------
AANG000790 --------------------------------------------------------------------------------
AANG000791 --------------------------------------------------------------------------------
AANG008702 -----------------------------------------------------------MEDTS----------------
AANG008980 -----------------------------------------------------------MARTG----------------
AANG010610 -----------------------------------------------------------MSVTT----------------
AANG010665 -----------------------------------------------------------MAANK----------------
AANG010667 --------------------------------------------------------------------------------
AANG010710 -----------------------MLSH-----------CFA-----------------YQAVTAPC------------LW`;

    const loadDemo = () => {
        const parsedSequences = demoData.trim().split('\n').map(line => {
            const [id, sequence] = line.split(/\s+/);
            return { id, sequence };
        });
        setSequences(parsedSequences);
        resetState();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const parsedSequences = parseFasta(content);
                setSequences(parsedSequences);
                resetState();
            };
            reader.readAsText(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const resetState = () => {
        setCurrentPage(0);
        setSearchResults([]);
        setSearchTerm('');
        setHighlightedColumns([]);
    };

    const parseFasta = (fastaContent) => {
        const lines = fastaContent.split('\n');
        const sequences = [];
        let currentId = '';
        let currentSequence = '';

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('>')) {
                if (currentId) {
                    sequences.push({ id: currentId, sequence: currentSequence });
                }
                currentId = line.substring(1);
                currentSequence = '';
            } else if (line) {
                currentSequence += line;
            }
        });

        if (currentId) {
            sequences.push({ id: currentId, sequence: currentSequence });
        }

        return sequences;
    };

    const getPageCount = () => Math.ceil(sequences[0]?.sequence.length / sequenceWidth) || 1;

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text'), 10);
        const newSequences = [...sequences];
        const [removed] = newSequences.splice(sourceIndex, 1);
        newSequences.splice(targetIndex, 0, removed);
        setSequences(newSequences);
    };

    const toggleHighlight = (columnIndex) => {
        setHighlightedColumns(prev =>
            prev.includes(columnIndex)
                ? prev.filter(col => col !== columnIndex)
                : [...prev, columnIndex]
        );
    };

    const handleSearch = () => {
        const results = sequences.map(seq => {
            const matches = [];
            let sequenceIndex = 0;
            let searchIndex = 0;
            let matchStart = -1;

            while (sequenceIndex < seq.sequence.length) {
                if (seq.sequence[sequenceIndex] === searchTerm[searchIndex] || seq.sequence[sequenceIndex] === '-') {
                    if (matchStart === -1) matchStart = sequenceIndex;
                    if (seq.sequence[sequenceIndex] !== '-') searchIndex++;
                    if (searchIndex === searchTerm.length) {
                        matches.push([matchStart, sequenceIndex + 1]);
                        searchIndex = 0;
                        matchStart = -1;
                    }
                } else {
                    searchIndex = 0;
                    matchStart = -1;
                }
                sequenceIndex++;
            }

            return { id: seq.id, matches };
        }).filter(result => result.matches.length > 0);

        setSearchResults(results);
    };

    const moveRowUp = (index) => {
        if (index > 0) {
            setSequences(prev => {
                const newSequences = [...prev];
                [newSequences[index - 1], newSequences[index]] = [newSequences[index], newSequences[index - 1]];
                return newSequences;
            });
        }
    };

    const moveRowDown = (index) => {
        if (index < sequences.length - 1) {
            setSequences(prev => {
                const newSequences = [...prev];
                [newSequences[index], newSequences[index + 1]] = [newSequences[index + 1], newSequences[index]];
                return newSequences;
            });
        }
    };

    const deleteRow = (index) => {
        setSequences(prev => prev.filter((_, i) => i !== index));
    };

    const removeRowToLast = (index) => {
        setSequences(prev => {
            const newSequences = [...prev];
            const [removed] = newSequences.splice(index, 1);
            newSequences.push(removed);
            return newSequences;
        });
    };

    const removeColumnToLast = (columnIndex) => {
        setSequences(prev => prev.map(seq => {
            const chars = seq.sequence.split('');
            const [removed] = chars.splice(columnIndex, 1);
            chars.push(removed);
            return { ...seq, sequence: chars.join('') };
        }));
    };

    const renderSequence = (sequence, id) => {
        const start = currentPage * sequenceWidth;
        const end = start + sequenceWidth;
        const displayedSequence = sequence.slice(start, end);

        const result = searchResults.find(r => r.id === id);
        const highlightRanges = result ? result.matches : [];

        return displayedSequence.split('').map((char, index) => {
            const absoluteIndex = start + index;
            const isHighlighted = highlightRanges.some(([start, end]) => absoluteIndex >= start && absoluteIndex < end);
            return (
                <td
                    key={index}
                    className={`border px-1 py-1 font-mono
                    ${highlightedColumns.includes(absoluteIndex) ? 'bg-yellow-200' : ''}
                    ${isHighlighted ? 'bg-green-300' : ''}`}
                    onClick={() => toggleHighlight(absoluteIndex)}
                >
                    {char}
                </td>
            );
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">FASTA Sequence Viewer and Editor</h2>
            <div className="mb-4 flex items-center space-x-2">
                <button onClick={loadDemo} className="bg-blue-500 text-white p-2 rounded">
                    Load Demo
                </button>
                <label className="bg-green-500 text-white p-2 rounded cursor-pointer">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".fasta,.fa,.txt"
                        ref={fileInputRef}
                    />
                    <Upload size={20} className="inline mr-2" />
                    Upload FASTA
                </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sequence"
                    className="border p-2"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
                    <Search size={20} />
                </button>
            </div>
            {sequences.length > 0 ? (
                <>
                    <div className="mb-4 flex justify-between items-center">
                        <button onClick={() => removeColumnToLast(currentPage * sequenceWidth)} className="bg-yellow-500 text-white p-2 rounded">
                            Remove First Visible Column to Last
                        </button>
                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="p-2 bg-gray-200 rounded-l"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="px-4">Page {currentPage + 1} of {getPageCount()}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(getPageCount() - 1, prev + 1))}
                                disabled={currentPage === getPageCount() - 1}
                                className="p-2 bg-gray-200 rounded-r"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1 font-mono bg-gray-200">Actions</th>
                                    <th className="border px-2 py-1 font-mono bg-gray-200 whitespace-nowrap" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>ID</th>
                                    {[...Array(sequenceWidth)].map((_, index) => (
                                        <th
                                            key={index}
                                            className="border px-1 py-1 font-mono bg-gray-200"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const sourceIndex = parseInt(e.dataTransfer.getData('text'), 10);
                                                const newSequences = sequences.map(seq => {
                                                    const chars = seq.sequence.split('');
                                                    const [removed] = chars.splice(sourceIndex, 1);
                                                    chars.splice(index, 0, removed);
                                                    return { ...seq, sequence: chars.join('') };
                                                });
                                                setSequences(newSequences);
                                            }}
                                        >
                                            {index + currentPage * sequenceWidth + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sequences.map((seq, rowIndex) => (
                                    <tr
                                        key={seq.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, rowIndex)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, rowIndex)}
                                        className="hover:bg-gray-100"
                                    >
                                        <td className="border px-2 py-1">
                                            <div className="flex space-x-1">
                                                <button 
                                                    onClick={() => moveRowUp(rowIndex)} 
                                                    className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                                                    title="Move row up"
                                                    disabled={rowIndex === 0}
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => moveRowDown(rowIndex)} 
                                                    className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                                                    title="Move row down"
                                                    disabled={rowIndex === sequences.length - 1}
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteRow(rowIndex)} 
                                                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                                                    title="Delete row"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => removeRowToLast(rowIndex)} 
                                                    className="text-yellow-500 hover:bg-yellow-100 p-1 rounded"
                                                    title="Move row to last"
                                                >
                                                    <ChevronsDown size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td
                                            className="border px-2 py-1 font-mono whitespace-nowrap"
                                            style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            title={seq.id}
                                        >
                                            {seq.id}
                                        </td>
                                        {renderSequence(seq.sequence, seq.id)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">No sequences loaded. Please load demo or upload a FASTA file.</p>
            )}
            {searchResults.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Search Results:</h3>
                    <ul>
                        {searchResults.map((result, index) => (
                            <li key={index} className="mb-1">{result.id} (Matches: {result.matches.length})</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FASTAViewer;