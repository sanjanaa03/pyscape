-- Quick Database Health Check for Code Duel
-- Run this in Supabase SQL Editor to verify your setup

-- 1. Check if tables exist
SELECT 
    'problems' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'problems')
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING - Run migrations/001_create_core_tables.sql'
    END as status
UNION ALL
SELECT 
    'duels' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'duels')
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING - Run migrations/002_create_duel_tables.sql'
    END as status
UNION ALL
SELECT 
    'duel_submissions' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'duel_submissions')
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING - Run migrations/002_create_duel_tables.sql'
    END as status;

-- 2. Check if problems are seeded
DO $$
DECLARE
    problem_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO problem_count FROM problems;
    
    IF problem_count = 0 THEN
        RAISE NOTICE '❌ NO PROBLEMS FOUND - Run migrations/003_seed_dummy_problem.sql';
    ELSE
        RAISE NOTICE '✅ Found % problem(s) in database', problem_count;
    END IF;
END $$;

-- 3. List all available problems
SELECT 
    id,
    title,
    language,
    difficulty,
    xp_reward,
    CASE 
        WHEN lesson_id IS NULL THEN '✅ Available for Code Duel'
        ELSE '⚠️ Tied to lesson'
    END as availability
FROM problems
ORDER BY difficulty, language;

-- 4. Summary
DO $$
DECLARE
    beginner_count INTEGER;
    intermediate_count INTEGER;
    advanced_count INTEGER;
    python_count INTEGER;
    javascript_count INTEGER;
    java_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO beginner_count FROM problems WHERE difficulty = 'beginner';
    SELECT COUNT(*) INTO intermediate_count FROM problems WHERE difficulty = 'intermediate';
    SELECT COUNT(*) INTO advanced_count FROM problems WHERE difficulty = 'advanced';
    SELECT COUNT(*) INTO python_count FROM problems WHERE language = 'python';
    SELECT COUNT(*) INTO javascript_count FROM problems WHERE language = 'javascript';
    SELECT COUNT(*) INTO java_count FROM problems WHERE language = 'java';
    
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════';
    RAISE NOTICE '    CODE DUEL DATABASE SUMMARY     ';
    RAISE NOTICE '═══════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE 'Problems by Difficulty:';
    RAISE NOTICE '  Beginner: %', beginner_count;
    RAISE NOTICE '  Intermediate: %', intermediate_count;
    RAISE NOTICE '  Advanced: %', advanced_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Problems by Language:';
    RAISE NOTICE '  Python: %', python_count;
    RAISE NOTICE '  JavaScript: %', javascript_count;
    RAISE NOTICE '  Java: %', java_count;
    RAISE NOTICE '';
    
    IF beginner_count = 0 THEN
        RAISE NOTICE '⚠️ WARNING: No beginner problems found!';
    END IF;
    
    RAISE NOTICE '═══════════════════════════════════';
END $$;
